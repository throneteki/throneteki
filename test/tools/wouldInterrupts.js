import fs from 'fs';
import path from 'path';
import * as espree from 'espree';
import { loadCardData, loadImplementations, repoRoot } from './cardIndex.js';

function triggerClauses(text) {
    return text
        .split(/<b>\s*Interrupt:\s*<\/b>/i)
        .slice(1)
        .map((clause) => /\bwould\b/i.test(clause.split(/<b>/i)[0].split('.')[0]));
}

function flag(objectExpression, name) {
    return objectExpression.properties.some(
        (property) =>
            property.key?.name === name &&
            property.value.type === 'Literal' &&
            property.value.value === true
    );
}

function interruptCalls(source) {
    const calls = [];
    const visit = (node) => {
        if (!node || typeof node.type !== 'string') {
            return;
        }

        if (
            node.type === 'CallExpression' &&
            node.callee.type === 'MemberExpression' &&
            node.callee.object.type === 'ThisExpression' &&
            node.callee.property.name === 'interrupt' &&
            node.arguments[0]?.type === 'ObjectExpression'
        ) {
            calls.push({
                canCancel: flag(node.arguments[0], 'canCancel'),
                would: flag(node.arguments[0], 'would')
            });
        }

        for (const value of Object.values(node)) {
            if (Array.isArray(value)) {
                value.forEach(visit);
            } else if (value && typeof value === 'object' && value !== node.parent) {
                visit(value);
            }
        }
    };

    visit(espree.parse(source, { ecmaVersion: 'latest', sourceType: 'module' }));
    return calls;
}

// A "would" interrupt resolves before forced interrupts (Rules Reference: Triggering Condition),
// so each one declares `would: true`. Cancel interrupts have their own earlier window.
export function wouldInterruptProblems() {
    const cardData = loadCardData();
    const problems = [];

    for (const implementation of loadImplementations()) {
        const text = implementation.codes.map((code) => cardData.get(code)?.text || '').join('');
        const clauses = triggerClauses(text);
        const source = fs.readFileSync(
            path.join(repoRoot, implementation.implementationPath),
            'utf8'
        );
        const allCalls = interruptCalls(source);
        const calls = allCalls.filter((call) => !call.canCancel);
        const declared = calls.filter((call) => call.would).length;
        const cancels = allCalls.length - calls.length;
        const expected = Math.max(0, clauses.filter(Boolean).length - cancels);

        if (declared !== expected) {
            problems.push(
                `${implementation.implementationPath}: ${declared} interrupt(s) declare would: true, the card text has ${expected}`
            );
        }
    }

    return problems;
}
