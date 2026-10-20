import fs from 'fs';
import path from 'path';

export const repoRoot = path.join(import.meta.dirname, '../..');
const cardsRoot = path.join(repoRoot, 'server/game/cards');
const specsRoot = path.join(repoRoot, 'test/server/cards');
const packsRoot = path.join(repoRoot, 'throneteki-json-data/packs');

function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory() ? walk(full) : [full];
    });
}

function toPosix(file) {
    return path.relative(repoRoot, file).split(path.sep).join('/');
}

export function loadCardData() {
    const byCode = new Map();
    for (const file of fs.readdirSync(packsRoot).filter((file) => file.endsWith('.json'))) {
        const pack = JSON.parse(fs.readFileSync(path.join(packsRoot, file), 'utf8'));
        for (const card of pack.cards) {
            byCode.set(card.code, { ...card, packCode: pack.code, packName: pack.name });
        }
    }
    return byCode;
}

export function specPathFor(implementationPath) {
    const relative = path.relative(cardsRoot, path.join(repoRoot, implementationPath));
    return toPosix(path.join(specsRoot, relative.replace(/\.js$/, '.spec.js')));
}

/**
 * Every card implementation, with its code and whether a spec exists at the matching path.
 */
export function loadImplementations() {
    return walk(cardsRoot)
        .filter((file) => file.endsWith('.js') && path.dirname(file) !== cardsRoot)
        .map((file) => {
            const source = fs.readFileSync(file, 'utf8');
            const codes = [...source.matchAll(/\.code\s*=\s*'([^']+)'/g)].map((match) => match[1]);
            const implementationPath = toPosix(file);
            const specPath = specPathFor(implementationPath);
            return {
                codes,
                group: path.relative(cardsRoot, path.dirname(file)).split(path.sep)[0],
                implementationPath,
                specPath,
                hasSpec: fs.existsSync(path.join(repoRoot, specPath)),
                hasHandler: /\bhandler\s*[:(]/.test(source)
            };
        })
        .filter((implementation) => implementation.codes.length > 0);
}
