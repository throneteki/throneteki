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

const ShortcutPatterns = [
    /\bintegration\(/,
    /\bbuildDeck\(/,
    /\bselectDeck\(/,
    /\bdragCard\(/,
    /\bsendChat\(/,
    /\bmoveCard\(/,
    /\bchangeStat\(/,
    /\btoggleManualDupes\(/,
    /\bmanualMode\b/,
    /\bvi\.(fn|spyOn)\(/,
    /\.(kneeled|power|gold)\s*=[^=]/
];

export function specStyleProblems(source) {
    const problems = ShortcutPatterns.filter((pattern) => pattern.test(source)).map(String);
    if (!/\b(this|context)\.setupTest\(/.test(source)) {
        problems.unshift('does not use setupTest');
    }
    return problems;
}

function cardsFolderImports(file, seen = new Set()) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/from\s+'(\.{1,2}\/[^']+)'/g)) {
        const imported = path.resolve(path.dirname(file), match[1]);
        if (imported.startsWith(cardsRoot + path.sep) && !seen.has(imported)) {
            seen.add(imported);
            cardsFolderImports(imported, seen);
        }
    }
    return seen;
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
            const baseFiles = [...cardsFolderImports(file)];
            const sources = [source, ...baseFiles.map((base) => fs.readFileSync(base, 'utf8'))];
            return {
                codes,
                group: path.relative(cardsRoot, path.dirname(file)).split(path.sep)[0],
                implementationPath,
                specPath,
                hasSpec: fs.existsSync(path.join(repoRoot, specPath)),
                baseFiles: baseFiles.map(toPosix),
                hasHandler: sources.some((text) => /\bhandler\s*[:(]/.test(text))
            };
        })
        .filter((implementation) => implementation.codes.length > 0);
}
