import fs from 'fs';
import path from 'path';

function specFiles(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory()
            ? specFiles(full)
            : entry.name.endsWith('.spec.js')
              ? [full]
              : [];
    });
}

describe('specs', function () {
    it('do not contain scenarioBreak calls', function () {
        const withBreaks = specFiles(import.meta.dirname).filter((file) =>
            /\bscenarioBreak\(\)/.test(fs.readFileSync(file, 'utf8'))
        );

        expect(withBreaks.map((file) => path.relative(import.meta.dirname, file))).toEqual([]);
    });
});
