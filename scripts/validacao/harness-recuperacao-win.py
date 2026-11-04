"""ORG.8B: live creation anchor + disposable rename executor, never disk adoption."""
import importlib.util
import json
import os
from pathlib import Path
import secrets
import subprocess
import sys

spec = importlib.util.spec_from_file_location('owned_native', Path(__file__).with_name('harness-fisico-win.py'))
n = importlib.util.module_from_spec(spec)
spec.loader.exec_module(n)

INTENT = 'restore-owned-synthetic-after-worker-exit'
FIELDS = ('root', 'file', 'sentinel', 'journal')


def same_json(candidate, expected):
    # Python's True == 1 and 1.0 == 1 must not make a mismatched receipt valid.
    return json.dumps(candidate, sort_keys=True, allow_nan=False) == json.dumps(expected, sort_keys=True, allow_nan=False)


def require_absent(parent, name):
    try:
        handle = n.opened(parent, name, access=n.ATTR | n.SYNC)
    except n.Blocked as error:
        if error.native_code == 0xc0000034:  # STATUS_OBJECT_NAME_NOT_FOUND only
            return
        raise
    n.k.CloseHandle(handle)
    raise n.Blocked('destination-exists')


def worker():
    # Private anonymous pipe from the live anchor, not a receipt loaded from disk.
    request = json.loads(sys.stdin.readline(16385))
    n.require(set(request) == {'handles', 'fileId', 'parentId', 'sha256', 'size', 'target', 'fault'}, 'worker-request-refused')
    file, parent = request['handles']
    n.require(request['target'] in ('counter.bin', 'quarantined.bin'), 'name-refused')
    n.require(request['fault'] in (None, 'before-rename', 'after-rename', 'process-exit'), 'fault-refused')
    # A second check inside the executor, using inherited handles only.
    current = n.info(file)
    n.require(current['fileId'] == request['fileId'] and current['size'] == request['size'], 'worker-identity-mismatch')
    n.require(n.info(parent, True)['fileId'] == request['parentId'], 'worker-parent-mismatch')
    n.require(n.hashlib.sha256(n.content(file)).hexdigest() == request['sha256'], 'content-mismatch')
    if request['fault'] == 'before-rename':
        os._exit(8)
    require_absent(parent, request['target'])
    n.rename(file, parent, request['target'])
    if request['fault'] in ('process-exit', 'after-rename'):
        os._exit(7)


class Anchor(n.Scenario):
    def __init__(self):
        super().__init__()
        self.pending = False
        self.selection = None
        self.recovery_grant = False
        self.recovery_receipt = None
        self.retired_selections = set()
        self.fail_next_start = False

    def create(self, request):
        result = super().create(request)
        # Immutable private snapshot taken ONLY from exclusive creations.
        self.recovery_receipt = {
            'receiptVersion': 1, 'anchorId': secrets.token_hex(32),
            'receiptId': secrets.token_hex(32), 'runId': self.run,
            'resourceId': self.resource_id, 'scopeId': self.scope_id,
            'rootId': result['rootId'], 'fileId': self.original['fileId'],
            'directoryIds': dict(self.directory_ids), 'sha256': self.sha,
            'size': len(self.expected),
        }
        self.locations = {name: n.final_name(getattr(self, name)) for name in FIELDS}
        self.directory_locations = {name: n.final_name(h) for name, h in self.dirs.items()}
        # Regenerations are already held by the base scenario and remain sealed.
        self.regenerations = self.handles[-2:]
        self.log('independent-live-anchor-established')
        return {**result, 'recoveryReceipt': self.recovery_receipt}

    def verify(self):
        result = super().verify()
        n.require(n.info(self.root, True)['fileId'] == self.recovery_receipt['rootId'], 'root-identity-mismatch')
        for name in ('root', 'sentinel', 'journal'):
            n.require(n.final_name(getattr(self, name)) == self.locations[name], 'perimeter-location-mismatch')
        for name, handle in self.dirs.items():
            n.require(n.final_name(handle) == self.directory_locations[name], 'perimeter-location-mismatch')
        for handle in self.regenerations:
            n.info(handle)
            n.require(n.content(handle) == self.expected, 'physical-regeneration-mismatch')
        return result

    def execute(self, op, fault):
        n.require(fault in (None, 'before-rename', 'after-rename', 'process-exit'), 'fault-refused')
        self.verify()
        target = 'quarantine' if op == 'quarantine' else 'source'
        n.require(self.position != target, 'operation-state-mismatch')
        require_absent(self.dirs['source'], 'quarantined.bin' if target == 'quarantine' else 'counter.bin')
        # Intent is durable BEFORE the worker can rename. An authorization is
        # consumed before process creation, including failures to start/complete.
        self.log(op + '-intent')
        self.position = 'indeterminate'
        handles = [self.file.value, self.dirs['source'].value]
        startup = subprocess.STARTUPINFO()
        startup.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        startup.wShowWindow = subprocess.SW_HIDE
        startup.lpAttributeList = {'handle_list': handles}
        payload = {'handles': handles, 'fileId': self.original['fileId'],
                   'parentId': self.directory_ids['source'], 'sha256': self.sha,
                   'size': len(self.expected), 'target': 'quarantined.bin' if target == 'quarantine' else 'counter.bin',
                   'fault': fault}
        child = None
        try:
            for handle in handles:
                os.set_handle_inheritable(handle, True)
            if self.fail_next_start:
                self.fail_next_start = False
                raise OSError('synthetic process creation failure')
            child = subprocess.Popen([sys.executable, '-I', '-B', '-u', str(Path(__file__).absolute()), '--worker'],
                                     stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
                                     close_fds=True, startupinfo=startup)
        finally:
            for handle in handles:
                os.set_handle_inheritable(handle, False)
        try:
            output, _ = child.communicate(json.dumps(payload).encode(), timeout=5)
        except subprocess.TimeoutExpired:
            child.kill()
            child.wait()
            output = b''
        except BaseException:
            child.kill()
            child.wait()
            raise
        if child.returncode != 0:
            self.pending = True
            self.grant.clear()
            self.log('executor-ended-without-confirmation')
            diagnostic = {}
            if child.returncode == 3 and len(output) <= 1024:
                diagnostic = json.loads(output)
            return {'ok': False, 'issue': 'executor-session-lost', **diagnostic, 'state': 'indeterminate',
                    'executorExitCode': child.returncode, 'anchorAlive': True}
        result = self.verify()
        self.pending = False
        self.log(op + '-verified')
        return {**result, 'executorExitCode': 0, 'anchorAlive': True}

    def command(self, request):
        op = request.get('op')
        if op == 'create':
            return self.create(request)
        n.require(self.ready, 'scenario-unavailable')
        if op == 'anchor-exit':
            os._exit(9)
        if op == 'identify-recovery':
            self.selection, self.recovery_grant = None, False
            # Exact private-memory comparison: a valid-looking target JSON is
            # NEVER the authority. No filesystem receipt/journal is read here.
            n.require(same_json(request.get('receipt'), self.recovery_receipt), 'creation-receipt-untrusted')
            n.require(self.pending, 'no-pending-recovery')
            result = self.verify()
            self.log('assisted-recovery-identified')
            if result['state'] == 'source':
                self.pending = False
                self.log('observed-already-restored')
                return {**result, 'recoveryNeeded': False, 'selection': None}
            n.require(len(self.retired_selections) < 32, 'recovery-attempt-limit')
            require_absent(self.dirs['source'], 'counter.bin')
            self.selection = {key: self.recovery_receipt[key] for key in
                              ('anchorId', 'receiptId', 'runId', 'resourceId', 'scopeId', 'rootId')}
            self.selection['selectionId'] = secrets.token_hex(32)
            return {**result, 'recoveryNeeded': True, 'selection': dict(self.selection)}
        if op == 'authorize-recovery':
            candidate = request.get('selection')
            n.require(isinstance(candidate, dict) and self.selection is not None and
                      same_json(candidate, {**self.selection, 'intent': INTENT}) and
                      self.selection['selectionId'] not in self.retired_selections, 'recovery-authorization-refused')
            # Consume the explicit selection once; even an interrupted attempt
            # needs fresh identification and authorization.
            self.retired_selections.add(self.selection['selectionId'])
            self.selection = None
            self.recovery_grant = False
            self.verify()
            n.require(self.pending and self.position == 'quarantine', 'recovery-state-mismatch')
            require_absent(self.dirs['source'], 'counter.bin')
            self.log('new-limited-recovery-authorization')
            self.recovery_grant = True
            return {'authorized': True, 'intent': INTENT}
        if op == 'restore-assisted':
            n.require(self.recovery_grant, 'recovery-authorization-required')
            self.recovery_grant = False
            return self.execute('restore', request.get('fault'))
        if op in ('quarantine', 'restore'):
            n.require(not self.pending, 'recovery-authorization-required')
            n.require(self.simulated and op in self.grant and op not in self.used, 'authorization-required')
            self.used.add(op)
            return self.execute(op, request.get('fault'))
        if op == 'authorize':
            n.require(not self.pending, 'recovery-authorization-required')
            n.require(request.get('runId') == self.run, 'authorization-refused')
        if op == 'invalidate-simulation':
            self.selection, self.recovery_grant = None, False
        if op == 'fault-same-size':
            n.write(self.file, bytes([self.expected[0] ^ 1]) + self.expected[1:], truncate=True)
            return {'fault': 'same-size-content-altered'}
        if op == 'fault-executor-start':
            self.fail_next_start = True
            return {'fault': 'next-executor-start-fails'}
        return super().command(request)


def main():
    anchor = Anchor()
    try:
        while True:
            line = sys.stdin.readline(16385)
            if not line:
                break
            try:
                n.require(len(line) <= 16384, 'request-limit')
                request = json.loads(line)
                n.require(isinstance(request, dict), 'request-refused')
                result = anchor.command(request)
                print(json.dumps({'ok': True, **result}), flush=True)
            except n.Blocked as error:
                if anchor.ready and anchor.position == 'indeterminate':
                    anchor.pending = True
                    anchor.grant.clear()
                print(json.dumps({'ok': False, 'issue': str(error), 'nativeCode': error.native_code,
                                  'state': anchor.position}), flush=True)
            except Exception:
                # A failed worker start/transport is never treated as completion.
                if anchor.ready and anchor.position == 'indeterminate':
                    anchor.pending = True
                    anchor.grant.clear()
                print(json.dumps({'ok': False, 'issue': 'anchor-operation-unavailable',
                                  'state': anchor.position}), flush=True)
    finally:
        anchor.close()


if __name__ == '__main__':
    if sys.argv[1:] == ['--worker']:
        try:
            worker()
        except n.Blocked as error:
            print(json.dumps({'issue': str(error), 'nativeCode': error.native_code}), flush=True)
            sys.exit(3)
    elif not sys.argv[1:]:
        main()
