"""Private Windows/NTFS backend. Fixed names, owned handles, no delete primitive."""
import ctypes as C
from ctypes import wintypes as W
import hashlib
import json
import os
from pathlib import Path
import re
import sys
import uuid


class Blocked(Exception):
    def __init__(self, issue, native_code=None):
        super().__init__(issue)
        self.native_code = native_code


if sys.platform != 'win32':
    print(json.dumps({'ok': False, 'issue': 'platform-unsupported'}), flush=True)
    sys.exit(0)

if C.sizeof(C.c_void_p) != 8:
    print(json.dumps({'ok': False, 'issue': 'architecture-unsupported'}), flush=True)
    sys.exit(0)

k = C.WinDLL('kernel32', use_last_error=True)
nt = C.WinDLL('ntdll')
H = C.c_void_p
READ, WRITE, DELETE, SYNC, ATTR = 0x80000000, 0x40000000, 0x10000, 0x100000, 0x80


class US(C.Structure):
    _fields_ = [('Length', W.USHORT), ('MaximumLength', W.USHORT), ('Buffer', H)]


class OA(C.Structure):
    _fields_ = [('Length', W.ULONG), ('RootDirectory', H), ('ObjectName', C.POINTER(US)),
                ('Attributes', W.ULONG), ('SecurityDescriptor', H), ('SecurityQoS', H)]


class IOS(C.Structure):
    _fields_ = [('Status', H), ('Information', C.c_size_t)]


class INFO(C.Structure):
    _fields_ = [('attrs', W.DWORD), ('created', W.FILETIME), ('accessed', W.FILETIME),
                ('written', W.FILETIME), ('volume', W.DWORD), ('sizeHi', W.DWORD),
                ('sizeLo', W.DWORD), ('links', W.DWORD), ('idHi', W.DWORD), ('idLo', W.DWORD)]


class RENAME(C.Structure):
    _fields_ = [('replace', W.DWORD), ('root', H), ('length', W.DWORD), ('name', W.WCHAR * 1)]


nt.NtCreateFile.argtypes = [C.POINTER(H), W.ULONG, C.POINTER(OA), C.POINTER(IOS), H,
                           W.ULONG, W.ULONG, W.ULONG, W.ULONG, H, W.ULONG]
nt.NtCreateFile.restype = W.LONG
nt.NtSetInformationFile.argtypes = [H, C.POINTER(IOS), H, W.ULONG, W.ULONG]
nt.NtSetInformationFile.restype = W.LONG
k.GetFileInformationByHandle.argtypes = [H, C.POINTER(INFO)]
k.GetFinalPathNameByHandleW.argtypes = [H, W.LPWSTR, W.DWORD, W.DWORD]
k.GetFinalPathNameByHandleW.restype = W.DWORD
k.GetVolumeInformationByHandleW.argtypes = [H, W.LPWSTR, W.DWORD, H, H, H, W.LPWSTR, W.DWORD]
k.GetDriveTypeW.argtypes = [W.LPCWSTR]
k.GetDriveTypeW.restype = W.UINT
k.SetFilePointerEx.argtypes = [H, C.c_longlong, H, W.DWORD]
k.SetEndOfFile.argtypes = [H]
k.ReadFile.argtypes = [H, H, W.DWORD, C.POINTER(W.DWORD), H]
k.WriteFile.argtypes = [H, H, W.DWORD, C.POINTER(W.DWORD), H]
k.FlushFileBuffers.argtypes = [H]
k.CloseHandle.argtypes = [H]


def require(condition, issue):
    if not condition:
        raise Blocked(issue)


def native_ok(status):
    if status < 0:
        code = status & 0xffffffff
        raise Blocked({0xc0000035: 'destination-exists', 0xc0000043: 'sharing-refused',
                       0xc0000279: 'reparse-refused', 0xc000050b: 'reparse-refused'}.get(code, 'native-operation-refused'), code)


def info(handle, directory=False):
    value = INFO()
    require(k.GetFileInformationByHandle(handle, C.byref(value)), 'metadata-unavailable')
    require(not value.attrs & 0x400, 'reparse-refused')
    require(bool(value.attrs & 0x10) == directory, 'object-type-mismatch')
    if not directory:
        require(value.links == 1, 'hardlink-refused')
    return {'fileId': f'{value.volume:08x}:{value.idHi:08x}{value.idLo:08x}',
            'size': (value.sizeHi << 32) | value.sizeLo,
            'created': str((value.created.dwHighDateTime << 32) | value.created.dwLowDateTime)}


def opened(parent, name, create=False, directory=False, access=None):
    # Every relative operation has one literal component, never an input path.
    if parent:
        require(re.fullmatch(r'[^\\/:*?"<>|\x00-\x1f]{1,255}', name) and name not in ('.', '..'), 'name-refused')
    text = C.create_unicode_buffer(name)
    string = US(len(name.encode('utf-16-le')), len(name.encode('utf-16-le')) + 2, C.cast(text, H))
    attrs = OA(C.sizeof(OA), parent, C.pointer(string), 0x1040, None, None)
    result, io = H(), IOS()
    # Attribute-only directory handles do not participate in Windows sharing
    # checks. A newly owned directory must include read/list access for its
    # deny-write/deny-delete share mode to be an effective lock.
    rights = access if access is not None else ((READ | ATTR | SYNC if create else ATTR | SYNC) if directory else READ | WRITE | DELETE | SYNC)
    options = 0x00200000 | 0x20 | (1 if directory else 0x40)
    native_ok(nt.NtCreateFile(C.byref(result), rights, C.byref(attrs), C.byref(io), None,
                            0, (1 if create else 3) if directory else (7 if access == ATTR | SYNC else 0),
                            2 if create else 1, options, None, 0))
    try:
        info(result, directory)
    except Exception:
        k.CloseHandle(result)
        raise
    return result


def content(handle):
    require(k.SetFilePointerEx(handle, 0, None, 0), 'seek-refused')
    buffer, read = C.create_string_buffer(257), W.DWORD()
    require(k.ReadFile(handle, buffer, 257, C.byref(read), None), 'read-refused')
    require(read.value <= 256, 'resource-limit')
    return buffer.raw[:read.value]


def write(handle, data, truncate=False):
    if truncate:
        require(k.SetFilePointerEx(handle, 0, None, 0), 'seek-refused')
    written = W.DWORD()
    require(k.WriteFile(handle, data, len(data), C.byref(written), None) and written.value == len(data), 'write-refused')
    if truncate:
        require(k.SetEndOfFile(handle), 'truncate-refused')
    require(k.FlushFileBuffers(handle), 'flush-refused')


def final_name(handle):
    buffer = C.create_unicode_buffer(2048)
    size = k.GetFinalPathNameByHandleW(handle, buffer, len(buffer), 0)
    require(0 < size < len(buffer), 'handle-name-unavailable')
    return buffer.value


def rename(handle, target, name, link=False):
    info(target, True)
    # Only an in-place rename by the retained source handle is supported.
    # Cross-directory operations would require weakening the directory lock.
    require(final_name(handle).rsplit('\\', 1)[0] == final_name(target), 'cross-directory-refused')
    require(name in ('counter.bin', 'quarantined.bin', 'displaced-preserved.bin', 'alias.bin'), 'name-refused')
    data = name.encode('utf-16-le')
    buffer = C.create_string_buffer(max(C.sizeof(RENAME), RENAME.name.offset + len(data)))
    header = C.cast(buffer, C.POINTER(RENAME)).contents
    header.replace, header.root, header.length = 0, None, len(data)
    C.memmove(C.addressof(buffer) + RENAME.name.offset, data, len(data))
    if link:
        io = IOS()
        native_ok(nt.NtSetInformationFile(handle, C.byref(io), buffer, len(buffer), 11))
    else:
        io = IOS()
        native_ok(nt.NtSetInformationFile(handle, C.byref(io), buffer, len(buffer), 10))


class Scenario:
    def __init__(self):
        self.handles, self.events, self.grant, self.used, self.consumers = [], [], set(), set(), set()
        self.position, self.ready, self.simulated = 'unknown', False, False

    def hold(self, *args, **kwargs):
        handle = opened(*args, **kwargs)
        self.handles.append(handle)
        return handle

    def log(self, event):
        row = {'event': event, 'resourceId': self.resource_id, 'state': self.position,
               'fileId': self.original['fileId'], 'sha256': self.sha, 'size': len(self.expected)}
        write(self.journal, (json.dumps(row, separators=(',', ':')) + '\n').encode())
        self.events.append(row)

    def create(self, request):
        require(not self.ready, 'scenario-already-created')
        self.run = request.get('runId')
        require(isinstance(self.run, str) and re.fullmatch('[a-z0-9-]{1,32}', self.run), 'run-refused')
        self.resource_id, self.scope_id = 'counter-' + self.run, 'scope-' + self.run
        self.expected = request.get('content', '').encode('utf-8')
        require(0 < len(self.expected) <= 256, 'resource-limit')
        regenerations = request.get('regenerations')
        require(isinstance(regenerations, list) and len(regenerations) == 2 and
                all(isinstance(v, str) and len(v.encode('utf-8')) <= 256 for v in regenerations), 'recipe-required')
        self.sha = hashlib.sha256(self.expected).hexdigest()
        base = Path(__file__).absolute().parents[2] / 'tmp'
        require(re.match(r'^[A-Za-z]:\\', str(base)), 'local-volume-required')
        require(k.GetDriveTypeW(base.anchor) == 3, 'fixed-local-volume-required')
        parent = self.hold(None, '\\??\\' + base.anchor, directory=True)
        for part in base.parts[1:]:
            parent = self.hold(parent, part, directory=True)
        fsname = C.create_unicode_buffer(32)
        require(k.GetVolumeInformationByHandleW(parent, None, 0, None, None, None, fsname, 32) and fsname.value == 'NTFS', 'ntfs-required')
        label = 'org8a-' + uuid.uuid4().hex
        self.root = self.hold(parent, label, create=True, directory=True)
        self.root_path = str(base / label)
        self.dirs = {name: self.hold(self.root, name, create=True, directory=True)
                     for name in ['source', 'regeneration', 'sentinel']}
        self.directory_ids = {name: info(h, True)['fileId'] for name, h in self.dirs.items()}
        self.file = self.hold(self.dirs['source'], 'counter.bin', create=True)
        write(self.file, self.expected)
        self.original = info(self.file)
        self.journal = self.hold(self.root, 'journal.jsonl', create=True)
        self.sentinel = self.hold(self.dirs['sentinel'], 'untouched.bin', create=True)
        write(self.sentinel, b'owned external sentinel')
        self.sentinel_hash = hashlib.sha256(content(self.sentinel)).hexdigest()
        self.position, self.ready = 'source', True
        self.log('created')
        attempts = []
        self.consumers.add('verifier')
        for name, regenerated in zip(['regen-a.bin', 'regen-b.bin'], regenerations):
            h = self.hold(self.dirs['regeneration'], name, create=True)
            write(h, regenerated.encode('utf-8'))
            require(content(h) == self.expected, 'physical-regeneration-mismatch')
            attempts.append(hashlib.sha256(content(h)).hexdigest())
        self.consumers.remove('verifier')
        self.log('regenerated-consumers-released')
        return {'root': self.root_path, 'rootId': info(self.root, True)['fileId'],
                'identity': self.original, 'sha256': self.sha, 'size': len(self.expected), 'attempts': attempts}

    def verify(self):
        require(self.ready, 'scenario-unavailable')
        require(not self.consumers, 'consumer-active')
        for name, h in self.dirs.items():
            require(info(h, True)['fileId'] == self.directory_ids[name], 'directory-identity-mismatch')
        current = info(self.file)
        # NTFS name tunneling can change creation time during a legitimate rename.
        # Authority is the retained owned handle + exact volume/file ID, not a timestamp.
        require(current['fileId'] == self.original['fileId'] and current['size'] == self.original['size'], 'resource-identity-or-size-mismatch')
        require(content(self.file) == self.expected and hashlib.sha256(content(self.file)).hexdigest() == self.sha, 'content-mismatch')
        require(hashlib.sha256(content(self.sentinel)).hexdigest() == self.sentinel_hash, 'external-sentinel-mismatch')
        actual = final_name(self.file)
        found = [state for state, name in [('source', 'counter.bin'), ('quarantine', 'quarantined.bin')]
                 if actual == final_name(self.dirs['source']) + '\\' + name]
        require(len(found) == 1, 'location-indeterminate')
        self.position = found[0]
        return {'state': self.position, 'identity': current, 'sha256': self.sha, 'sentinelUnchanged': True}

    def command(self, request):
        op = request.get('op')
        if op == 'create':
            return self.create(request)
        require(self.ready, 'scenario-unavailable')
        if op == 'invalidate-simulation':
            self.simulated = False
            self.grant.clear()
            self.log('simulation-invalidated')
            return {'invalidated': True}
        if op == 'bind-simulation':
            self.verify()
            require(request.get('resourceId') == self.resource_id and request.get('scopeId') == self.scope_id and
                    request.get('fileId') == self.original['fileId'] and request.get('result') == 'recognized' and
                    request.get('cleanupAuthorization') == 'none', 'simulation-refused')
            self.simulated = True
            self.log('simulation-bound-without-authorization')
            return {'simulationBound': True}
        if op == 'authorize':
            require(self.simulated and request.get('rootId') == info(self.root, True)['fileId'] and
                    request.get('scopeId') == self.scope_id and request.get('resourceId') == self.resource_id and
                    request.get('intent') == 'quarantine-and-restore-owned-synthetic', 'authorization-refused')
            self.grant = {'quarantine', 'restore'}
            self.log('explicit-test-authorization')
            return {'authorized': True}
        if op == 'verify' or op == 'recover':
            result = self.verify()
            if op == 'recover': self.log('reconciled-from-owned-handle')
            return result
        if op in ('quarantine', 'restore'):
            require(request.get('fault') in (None, 'before-rename', 'after-rename', 'process-exit'), 'fault-refused')
            require(self.simulated and op in self.grant and op not in self.used, 'authorization-required')
            self.verify()
            target = 'quarantine' if op == 'quarantine' else 'source'
            require(self.position != target, 'operation-state-mismatch')
            self.log(op + '-intent')
            if request.get('fault') == 'before-rename': raise Blocked('simulated-before-rename')
            rename(self.file, self.dirs['source'], 'quarantined.bin' if target == 'quarantine' else 'counter.bin')
            self.used.add(op)
            self.position = 'indeterminate'
            if request.get('fault') == 'process-exit': os._exit(7)
            if request.get('fault') == 'after-rename': raise Blocked('simulated-after-rename')
            result = self.verify()
            self.log(op + '-verified')
            return result
        if op == 'fault-tamper':
            write(self.file, b'altered synthetic fixture', truncate=True)
            return {'fault': 'content-altered'}
        if op == 'fault-consumer':
            self.consumers.add('synthetic-observer')
            return {'fault': 'consumer-active'}
        if op == 'fault-identity':
            rename(self.file, self.dirs['source'], 'displaced-preserved.bin')
            replacement = self.hold(self.dirs['source'], 'counter.bin', create=True)
            write(replacement, self.expected)
            return {'fault': 'identity-replaced-with-owned-fixture'}
        if op == 'fault-hardlink':
            rename(self.file, self.dirs['source'], 'alias.bin', link=True)
            return {'fault': 'hardlink-created'}
        if op == 'fault-collision':
            target = 'quarantine' if self.position == 'source' else 'source'
            self.collision = self.hold(self.dirs['source'], 'quarantined.bin' if target == 'quarantine' else 'counter.bin', create=True)
            write(self.collision, b'owned destination sentinel')
            return {'fault': 'destination-created'}
        if op == 'probe-link':
            name = request.get('name')
            require(name in ('junction.bin', 'symlink.bin'), 'name-refused')
            self.hold(self.root, name, directory=name == 'junction.bin', access=ATTR | SYNC)
            raise Blocked('link-probe-unexpected')
        raise Blocked('command-refused')

    def close(self):
        for handle in reversed(self.handles):
            k.CloseHandle(handle)


def main():
    scenario = Scenario()
    try:
        for line in sys.stdin:
            try:
                require(len(line) <= 4096, 'request-limit')
                request = json.loads(line)
                require(isinstance(request, dict), 'request-refused')
                result = scenario.command(request)
                print(json.dumps({'ok': True, **result}), flush=True)
            except Blocked as error:
                print(json.dumps({'ok': False, 'issue': str(error), 'nativeCode': error.native_code, 'state': scenario.position}), flush=True)
            except Exception:
                print(json.dumps({'ok': False, 'issue': 'backend-unavailable', 'state': scenario.position}), flush=True)
    finally:
        scenario.close()


if __name__ == '__main__':
    main()
