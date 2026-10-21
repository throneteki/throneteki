/* eslint no-console: 0 */
// Temporary: rewrites `this` inside arrow functions in card files to the ability context.
// node test/tools/_this_codemod.mjs [--write] <file>...
import fs from 'fs';
import * as acorn from 'acorn';
import MagicString from 'magic-string';

const write = process.argv.includes('--write');
const files = process.argv
    .slice(2)
    .filter((arg) => arg !== '--write')
    .flatMap((arg) =>
        arg.startsWith('@')
            ? fs.readFileSync(arg.slice(1), 'utf8').split(String.fromCharCode(10)).map((line) => line.trim()).filter(Boolean)
            : [arg]
    );

function contextIndexes(path) {
    const source = fs.readFileSync(path, 'utf8');
    const ast = acorn.parse(source, { ecmaVersion: 'latest', sourceType: 'module' });
    const result = {};
    walk(ast, null, (node) => {
        if (
            node.type === 'Property' &&
            !node.computed &&
            node.key.type === 'Identifier' &&
            ['FunctionExpression', 'ArrowFunctionExpression'].includes(node.value.type) &&
            node.value.params.length > 0 &&
            node.value.params[0].type === 'Identifier'
        ) {
            const param = node.value.params[0].name;
            walk(node.value.body, null, (inner) => {
                if (
                    inner.type === 'CallExpression' &&
                    inner.callee.type === 'Identifier' &&
                    inner.callee.name === param
                ) {
                    const index = inner.arguments.findIndex(
                        (arg) => arg.type === 'Identifier' && arg.name === 'context'
                    );
                    if (index >= 0) {
                        result[node.key.name] = index;
                    }
                }
            });
        }
    });
    return result;
}

function walk(node, parent, visit) {
    if (!node || typeof node.type !== 'string') {
        return;
    }
    node.parent = parent;
    visit(node);
    for (const key of Object.keys(node)) {
        if (key === 'parent') {
            continue;
        }
        const value = node[key];
        if (Array.isArray(value)) {
            value.forEach((child) => walk(child, node, visit));
        } else if (value && typeof value.type === 'string') {
            walk(value, node, visit);
        }
    }
}

const EffectContext = contextIndexes('server/game/effects.js');
for (const match of fs
    .readFileSync('server/game/effects.js', 'utf8')
    .matchAll(/^    (\w+): cannotEffect\(/gm)) {
    EffectContext[match[1]] = 1;
}
const PropertyIndex = {
    condition: [0, []],
    handler: [0, []],
    cardCondition: [1, ['card']],
    match: [1, ['card']]
};

function memberName(node) {
    return node.type === 'MemberExpression' && !node.computed ? node.property.name : null;
}

function isCallee(node, objectName) {
    return (
        node.type === 'MemberExpression' &&
        ((node.object.type === 'Identifier' && node.object.name === objectName) ||
            (node.object.type === 'MemberExpression' && memberName(node.object) === objectName))
    );
}

// Where an arrow receives the ability context: [index, placeholder names for earlier params].
function contextPosition(arrow) {
    const parent = arrow.parent;
    if (parent.type === 'Property' && parent.value === arrow && !parent.computed) {
        const object = parent.parent;
        const owner = object.parent;
        if (owner && owner.type === 'Property' && owner.value === object) {
            if (owner.key.name === 'when') {
                return [1, ['event']];
            }
            if (owner.key.name === 'args') {
                return [0, []];
            }
            if (owner.key.name === 'match' && parent.key.name === 'condition') {
                return [1, ['card']];
            }
        }
        return PropertyIndex[parent.key.name];
    }
    if (parent.type === 'CallExpression' && parent.arguments[0] === arrow) {
        const callee = parent.callee;
        if (isCallee(callee, 'GameActions')) {
            return [0, []];
        }
        if (isCallee(callee, 'effects') && EffectContext[memberName(callee)] !== undefined) {
            const index = EffectContext[memberName(callee)];
            return [index, ['card', 'arg'].slice(0, index)];
        }
        if (isCallee(callee, 'costs') && memberName(callee) !== 'kneelSpecific') {
            return [1, ['card']];
        }
    }
    return undefined;
}

function transform(path) {
    const source = fs.readFileSync(path, 'utf8');
    const ast = acorn.parse(source, { ecmaVersion: 'latest', sourceType: 'module' });
    const output = new MagicString(source);
    const thisNodes = [];
    walk(ast, null, (node) => {
        if (node.type === 'ThisExpression') {
            thisNodes.push(node);
        }
    });

    const newParams = new Map();
    const failures = [];

    for (const node of thisNodes) {
        let arrows = [];
        for (let current = node.parent; current; current = current.parent) {
            if (current.type === 'FunctionExpression' || current.type === 'FunctionDeclaration') {
                break;
            }
            if (current.type === 'ArrowFunctionExpression') {
                arrows.push(current);
            }
        }
        if (arrows.length === 0) {
            continue;
        }

        let name;
        let unresolved = false;
        const inner = [];
        for (const arrow of arrows) {
            const position = contextPosition(arrow);
            if (position) {
                const [index, placeholders] = position;
                const pending = newParams.get(arrow);
                const param = pending ? undefined : arrow.params[index];
                if (pending) {
                    name = pending[index];
                } else if (param) {
                    if (param.type !== 'Identifier') {
                        unresolved = true;
                        break;
                    }
                    name = param.name;
                } else if (arrow.params.some((p) => p.type !== 'Identifier')) {
                    unresolved = true;
                    break;
                } else {
                    const names = arrow.params.map((p) => p.name);
                    while (names.length < index) {
                        names.push(placeholders[names.length] || `arg${names.length}`);
                    }
                    names.push(names.includes('context') ? 'effectContext' : 'context');
                    newParams.set(arrow, names);
                    name = names[index];
                }
                const shadowed = inner.some((innerArrow) =>
                    (newParams.get(innerArrow) || innerArrow.params.map((p) => p.name)).includes(name)
                );
                if (shadowed) {
                    name = undefined;
                    unresolved = true;
                }
                break;
            }
            inner.push(arrow);
        }

        if (!name) {
            const line = source.slice(0, node.start).split('\n').length;
            failures.push(line);
            continue;
        }

        const parent = node.parent;
        if (memberName(parent) === 'game' && parent.object === node) {
            output.overwrite(parent.start, parent.end, `${name}.game`);
        } else {
            output.overwrite(node.start, node.end, `${name}.source`);
        }
    }

    if (failures.length > 0) {
        return { failures };
    }

    for (const [arrow, names] of newParams) {
        const bodyStart = arrow.body.start;
        const arrowToken = source.lastIndexOf('=>', bodyStart);
        output.overwrite(arrow.start, arrowToken, `(${names.join(', ')}) `);
    }

    return { changed: output.toString() !== source, text: output.toString() };
}

let failed = 0;
for (const path of files) {
    const result = transform(path);
    if (result.failures) {
        failed++;
        console.log(`SKIP ${path}: lines ${result.failures.join(', ')}`);
        continue;
    }
    if (result.changed && write) {
        fs.writeFileSync(path, result.text);
    }
}
console.log(`${files.length - failed} converted, ${failed} skipped`);
