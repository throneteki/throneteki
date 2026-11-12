import fs from 'fs';
import os from 'os';
import path from 'path';
import { isCompleteJson } from '../../../server/devtools/scenario/host.js';

describe('scenario host', function () {
    beforeEach(function () {
        this.dir = fs.mkdtempSync(path.join(os.tmpdir(), 'scenario-host-'));
        this.file = path.join(this.dir, 'report.json');
    });

    afterEach(function () {
        fs.rmSync(this.dir, { recursive: true, force: true });
    });

    it('treats a complete report file as ready to load', function () {
        fs.writeFileSync(this.file, JSON.stringify({ id: 'report' }));

        expect(isCompleteJson(this.file)).toBe(true);
    });

    it('waits for a report file that is only partly written', function () {
        fs.writeFileSync(this.file, '{"id": "rep');

        expect(isCompleteJson(this.file)).toBe(false);
    });

    it('waits for a report file that does not exist yet', function () {
        expect(isCompleteJson(this.file)).toBe(false);
    });
});
