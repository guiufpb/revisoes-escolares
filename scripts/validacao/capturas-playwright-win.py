"""Bounded metadata bridge for test-results PNGs. No image IO or maintenance API."""
import ctypes as C
from ctypes import wintypes as W
import json
import os
import stat
import sys
import time


def collect(root, limits):
    if sys.platform != 'win32' or C.sizeof(C.c_void_p) != 8:
        return {'version': 1, 'status': 'partial', 'resources': [], 'directories': [],
                'issues': ['native-platform-unsupported'], 'excludedFiles': 0}
    k = C.WinDLL('kernel32', use_last_error=True)

    class Standard(C.Structure):
        _fields_ = [('allocation', C.c_longlong), ('eof', C.c_longlong), ('links', W.DWORD),
                    ('pending', C.c_ubyte), ('directory', C.c_ubyte)]

    class Identity(C.Structure):
        _fields_ = [('volume', C.c_ulonglong), ('fileid', C.c_ubyte * 16)]

    class Attributes(C.Structure):
        _fields_ = [('attributes', W.DWORD), ('tag', W.DWORD)]

    k.CreateFileW.argtypes = [W.LPCWSTR, W.DWORD, W.DWORD, C.c_void_p, W.DWORD, W.DWORD, W.HANDLE]
    k.CreateFileW.restype = W.HANDLE
    k.GetFileInformationByHandleEx.argtypes = [W.HANDLE, C.c_int, C.c_void_p, W.DWORD]
    k.GetFileInformationByHandleEx.restype = W.BOOL
    k.CloseHandle.argtypes = [W.HANDLE]
    k.CloseHandle.restype = W.BOOL
    reparse = stat.FILE_ATTRIBUTE_REPARSE_POINT
    start = time.monotonic()
    result = {'version': 1, 'status': 'complete', 'resources': [], 'directories': [],
              'issues': [], 'excludedFiles': 0, 'entriesVisited': 0}

    def issue(code):
        result['status'] = 'partial'
        if code not in result['issues']:
            result['issues'].append(code)

    def signature(s):
        return {'device': str(s.st_dev), 'fileId': str(s.st_ino), 'bytes': s.st_size, 'regular': stat.S_ISREG(s.st_mode),
                'links': s.st_nlink, 'mtimeNs': str(s.st_mtime_ns),
                'ctimeNs': str(s.st_ctime_ns), 'attributes': s.st_file_attributes}

    def directory(p):
        s = os.lstat(p)
        if s.st_file_attributes & reparse or not stat.S_ISDIR(s.st_mode):
            raise ValueError('directory-linked-or-unsupported')
        if not s.st_dev or not s.st_ino:
            raise ValueError('directory-identity-unavailable')
        return s

    def metadata(p, s):
        value = {**signature(s), 'allocatedBytes': None, 'issues': []}
        if s.st_file_attributes & reparse:
            value['issues'].append('reparse-refused')
            return value
        if not stat.S_ISREG(s.st_mode):
            value['issues'].append('not-regular-file')
            return value
        if not s.st_dev or not s.st_ino:
            value['issues'].append('identity-unavailable')
            return value
        # Attribute access only; all sharing enabled; OPEN_EXISTING + OPEN_REPARSE_POINT.
        h = k.CreateFileW(p, 0x80, 7, None, 3, 0x00200000, None)
        if h == C.c_void_p(-1).value:
            value['issues'].append('metadata-handle-unavailable')
            return value
        try:
            a, identity, standard = Attributes(), Identity(), Standard()
            for kind, obj in [(9, a), (18, identity), (1, standard)]:
                if not k.GetFileInformationByHandleEx(h, kind, C.byref(obj), C.sizeof(obj)):
                    raise ValueError('native-metadata-unavailable')
            if a.attributes & reparse:
                raise ValueError('reparse-refused')
            if (identity.volume, int.from_bytes(bytes(identity.fileid), 'little')) != (s.st_dev, s.st_ino):
                raise ValueError('identity-changed')
            if standard.directory or standard.pending or standard.eof != s.st_size or standard.links != s.st_nlink:
                raise ValueError('metadata-changed')
            if signature(os.lstat(p)) != signature(s):
                raise ValueError('metadata-changed')
            if a.attributes & (0x200 | 0x800):
                value['allocationIssue'] = 'sparse-or-compressed-allocation-uncertified'
            elif standard.allocation >= 0:
                value['allocatedBytes'] = standard.allocation
            else:
                value['allocationIssue'] = 'allocation-unavailable'
        except ValueError as error:
            value['issues'].append(str(error))
        except OSError:
            value['issues'].append('native-metadata-unavailable')
        finally:
            if not k.CloseHandle(h):
                value['issues'].append('metadata-handle-close-failed')
        return value

    try:
        if not isinstance(root, str) or not os.path.isabs(root) or root.startswith(('\\\\', '//')):
            raise ValueError('root-invalid')
        chain = []
        p = os.path.abspath(root)
        while True:
            chain.append(p)
            parent = os.path.dirname(p)
            if parent == p:
                break
            p = parent
        for p in reversed(chain):
            directory(p)
        base = os.path.join(root, 'test-results')
        try:
            base_stat = directory(base)
        except FileNotFoundError:
            result['status'] = 'absent'
            return result
        queue = [(base, 0)]
        while queue:
            if time.monotonic() - start > limits['seconds'] or len(result['directories']) >= limits['directories']:
                issue('discovery-limit')
                break
            p, depth = queue.pop()
            try:
                before = directory(p)
                if before.st_dev != base_stat.st_dev:
                    raise ValueError('mount-or-other-volume-refused')
                if os.path.lexists(os.path.join(p, '.git')):
                    raise ValueError('nested-repository-refused')
                relative_dir = os.path.relpath(p, root).replace('\\', '/')
                result['directories'].append({'path': relative_dir, **signature(before)})
                with os.scandir(p) as listing:
                    for entry in listing:
                        if result['entriesVisited'] >= limits['entries'] or len(result['resources']) >= limits['files'] or time.monotonic() - start > limits['seconds']:
                            issue('discovery-limit')
                            queue.clear()
                            break
                        result['entriesVisited'] += 1
                        s = os.lstat(entry.path)  # DirEntry cache has zero identity fields on Windows.
                        relative = os.path.relpath(entry.path, root).replace('\\', '/')
                        if s.st_file_attributes & reparse:
                            issue('reparse-refused')
                            if entry.name.lower().endswith('.png'):
                                result['resources'].append({'path': relative, **signature(s), 'allocatedBytes': None, 'issues': ['reparse-refused']})
                            continue
                        if stat.S_ISDIR(s.st_mode):
                            if depth >= limits['depth']:
                                issue('depth-limit')
                            elif s.st_dev != base_stat.st_dev:
                                issue('mount-or-other-volume-refused')
                            else:
                                queue.append((entry.path, depth + 1))
                        elif entry.name.lower().endswith('.png'):
                            result['resources'].append({'path': relative, **metadata(entry.path, s)})
                        else:
                            result['excludedFiles'] += 1
                if signature(directory(p)) != signature(before):
                    issue('directory-changed')
            except ValueError as error:
                issue(str(error))
            except OSError:
                issue('discovery-unavailable')
        result['resources'].sort(key=lambda item: item['path'])
        result['directories'].sort(key=lambda item: item['path'])
    except ValueError as error:
        issue(str(error))
    except OSError:
        issue('root-or-scope-unavailable')
    result['elapsedMs'] = round((time.monotonic() - start) * 1000, 3)
    return result


if __name__ == '__main__':
    try:
        request = json.loads(sys.stdin.readline(8193))
        limits = request['limits']
        maximum = {'files': 500, 'entries': 4096, 'directories': 256, 'depth': 8, 'seconds': 10}
        if set(limits) != set(maximum) or any(type(limits[k]) is not int or not 1 <= limits[k] <= v for k, v in maximum.items()):
            raise ValueError()
        print(json.dumps(collect(request['root'], limits)), flush=True)
    except Exception:
        print(json.dumps({'version': 1, 'status': 'partial', 'resources': [], 'directories': [],
                          'issues': ['request-or-native-metadata-unavailable'], 'excludedFiles': 0}), flush=True)
