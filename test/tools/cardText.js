// Keeps each card implementation's text comment in step with the card data.
//   node test/tools/cardText.js           fails if any comment is missing or out of date
//   node test/tools/cardText.js --write   rewrites the comments
import fs from 'fs';
import path from 'path';
import { loadCardData, loadImplementations, repoRoot } from './cardIndex.js';

const Indent = '    ';
const Width = 100;
const HeaderPattern = /^\s*\/\/ .+ \((\d+[^)]*)\)$/;

export function plainText(text) {
    return (text || '')
        .replace(/<\/?\s*(b|i|em)\s*>/g, '')
        .replace(/&mdash;/g, '—')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
}

function wrap(line) {
    const prefix = `${Indent}// `;
    const lines = [];
    let current = '';
    for (const word of line.split(/\s+/)) {
        if (current && prefix.length + current.length + 1 + word.length > Width) {
            lines.push(current);
            current = word;
        } else {
            current = current ? `${current} ${word}` : word;
        }
    }
    lines.push(current);
    return lines.map((text) => `${prefix}${text}`);
}

export function commentFor(cards) {
    const printings = [];
    for (const card of cards) {
        const text = plainText(card.text);
        const same = printings.find((printing) => printing.text.join('\n') === text.join('\n'));
        if (same) {
            same.codes.push(card.code);
        } else {
            printings.push({ name: card.name, codes: [card.code], text });
        }
    }

    if (printings.every((printing) => printing.text.length === 0)) {
        return [];
    }

    return printings.flatMap((printing) => [
        `${Indent}// ${printing.name} (${printing.codes.join(', ')})`,
        ...printing.text.flatMap(wrap)
    ]);
}

function classBounds(lines) {
    const start = lines.findIndex((line) => /^(export default )?class \w+/.test(line));
    if (start === -1) {
        return null;
    }
    const end = lines.findIndex((line, index) => index > start && line === '}');
    return { start, end: end === -1 ? lines.length : end };
}

function existingBlock(lines, bounds) {
    for (let index = bounds.start + 1; index < bounds.end; ++index) {
        if (HeaderPattern.test(lines[index])) {
            let end = index;
            while (end + 1 < bounds.end && /^\s*\/\/ /.test(lines[end + 1])) {
                ++end;
            }
            return { start: index, end };
        }
    }
    return null;
}

export function withComment(source, comment) {
    const newline = source.includes('\r\n') ? '\r\n' : '\n';
    const lines = source.split(/\r?\n/);
    const bounds = classBounds(lines);
    if (!bounds) {
        return source;
    }

    const block = existingBlock(lines, bounds);
    if (block) {
        lines.splice(block.start, block.end - block.start + 1, ...comment);
        return lines.join(newline);
    }

    if (comment.length === 0) {
        return source;
    }

    const setup = lines.findIndex(
        (line, index) =>
            index > bounds.start && index < bounds.end && /^ {4}setupCardAbilities\(/.test(line)
    );
    lines.splice(setup === -1 ? bounds.start + 1 : setup, 0, ...comment);
    return lines.join(newline);
}

export function cardTextProblems({ write = false } = {}) {
    const cardData = loadCardData();
    const problems = [];

    for (const implementation of loadImplementations()) {
        const cards = implementation.codes.map((code) => cardData.get(code)).filter(Boolean);
        const file = path.join(repoRoot, implementation.implementationPath);
        const source = fs.readFileSync(file, 'utf8');
        const updated = withComment(source, commentFor(cards));

        if (updated !== source) {
            if (write) {
                fs.writeFileSync(file, updated);
            } else {
                problems.push(implementation.implementationPath);
            }
        }
    }

    return problems;
}

if (process.argv[1] === import.meta.filename) {
    const write = process.argv.includes('--write');
    const problems = cardTextProblems({ write });
    if (problems.length > 0) {
        console.error(
            `${problems.length} card files have a missing or out-of-date text comment. Run "npm run card-text -- --write".`
        );
        for (const problem of problems.slice(0, 20)) {
            console.error(`  ${problem}`);
        }
        process.exit(1);
    }
    console.log(
        write ? 'Card text comments are up to date.' : 'Card text comments match the card data.'
    );
}
