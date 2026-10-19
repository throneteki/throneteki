/*
 * Scenario runner: builds a live game in the state of one test from a spec file, so a bug can be
 * reproduced or a card tried out in the real client.
 *
 * The scenario is `path/to/Card.spec.js#test name`. The part after `#` is a case-insensitive
 * substring of the test's full name (its describe and it labels joined with spaces). Without it,
 * the first test in the file is used.
 *
 * The spec is loaded with stand-ins for vitest's globals. The chosen test's beforeAll and
 * beforeEach hooks and its body then run against a context like the one specs get, except that
 * the game is built for real users. `expect` does nothing, and `this.scenarioBreak()` stops the
 * test at that point and keeps the game as it is.
 */

import path from 'path';
import { pathToFileURL } from 'url';
import { addSetupTest, attachFlow } from '../../../test/helpers/integrationhelper.js';

const ScenarioBreak = Symbol('scenarioBreak');

function noop() {
    const proxy = new Proxy(function () {}, {
        get: (target, property) => (property === 'then' ? undefined : proxy),
        apply: () => proxy
    });
    return proxy;
}

function createSuite(name, parent) {
    return { name, parent, beforeAll: [], beforeEach: [], tests: [], suites: [] };
}

async function loadSpec(specPath, getFlowOptions) {
    const root = createSuite('', null);
    let current = root;

    const describe = (name, fn) => {
        const suite = createSuite(name, current);
        current.suites.push(suite);
        current = suite;
        try {
            fn();
        } finally {
            current = suite.parent;
        }
    };
    describe.skip = describe;
    describe.only = describe;

    const it = (name, fn) => {
        if (fn) {
            current.tests.push({ name, fn, suite: current });
        }
    };
    it.skip = it;
    it.only = it;
    it.todo = () => true;

    const stubs = {
        describe,
        it,
        test: it,
        beforeEach: (fn) => current.beforeEach.push(fn),
        beforeAll: (fn) => current.beforeAll.push(fn),
        afterEach: () => true,
        afterAll: () => true,
        expect: noop(),
        vi: noop(),
        integration: (options, definitions) => {
            if (typeof options === 'function') {
                definitions = options;
                options = {};
            }

            describe('integration', function () {
                current.beforeEach.push(function () {
                    attachFlow(this, { ...options, ...getFlowOptions() });
                });
                definitions();
            });
        }
    };

    const url = pathToFileURL(path.resolve(specPath));
    url.search = `scenario=${Date.now()}`;
    await withGlobals(stubs, () => import(url.href));

    return { root, stubs };
}

// The stand-ins stay in place while the test runs as well as while it loads, because test bodies
// call `expect` and friends when they run.
async function withGlobals(stubs, fn) {
    const saved = Object.fromEntries(Object.keys(stubs).map((key) => [key, globalThis[key]]));
    Object.assign(globalThis, stubs);
    try {
        return await fn();
    } finally {
        Object.assign(globalThis, saved);
    }
}

function fullName(test) {
    const names = [test.name];
    for (let suite = test.suite; suite && suite.parent; suite = suite.parent) {
        names.unshift(suite.name);
    }
    return names.join(' ');
}

function allTests(suite) {
    return [...suite.tests, ...suite.suites.flatMap(allTests)];
}

function chooseTest(root, fragment, logger) {
    const tests = allTests(root);
    if (tests.length === 0) {
        throw new Error('The spec has no tests');
    }

    if (!fragment) {
        if (tests.length > 1) {
            logger.warn(`Scenario has ${tests.length} tests; using "${fullName(tests[0])}"`);
        }
        return tests[0];
    }

    const lowerFragment = fragment.toLowerCase();
    const test = tests.find((test) => fullName(test).toLowerCase().includes(lowerFragment));
    if (!test) {
        throw new Error(
            `No test matches "${fragment}". Tests in the spec:\n${tests.map((test) => `  ${fullName(test)}`).join('\n')}`
        );
    }

    return test;
}

function suiteChain(test) {
    const chain = [];
    for (let suite = test.suite; suite; suite = suite.parent) {
        chain.unshift(suite);
    }
    return chain;
}

/**
 * @param {string} scenario `path/to/Card.spec.js#test name`
 * @param {object} options
 * @param {object[]} options.users the users who will play player1 and player2
 * @param {object} [options.router] the game node, as the game's router
 * @param {string} [options.gameId]
 * @param {object} [options.gameOptions] extra options for the Game, such as card data
 * @param {object} [options.logger]
 * @returns {Promise<{ game: import('../../game/game.js').default, name: string, stoppedAtBreak: boolean, error?: Error }>}
 */
export async function runScenario(scenario, options) {
    const logger = options.logger || console;
    const [specPath, fragment] = scenario.split('#');
    const flowOptions = {
        users: options.users,
        router: options.router,
        gameId: options.gameId,
        gameOptions: options.gameOptions,
        disableWinning: false
    };

    const { root, stubs } = await loadSpec(specPath, () => flowOptions);
    const test = chooseTest(root, fragment, logger);
    const context = {};

    addSetupTest(context, flowOptions);
    context.scenarioBreak = () => {
        throw ScenarioBreak;
    };

    let stoppedAtBreak = false;
    let error;
    try {
        await withGlobals(stubs, () => runTest(test, context));
    } catch (e) {
        if (e === ScenarioBreak) {
            stoppedAtBreak = true;
        } else {
            error = e;
        }
    }

    if (!context.game) {
        throw error || new Error('The test did not create a game; does it call setupTest?');
    }

    return { game: context.game, name: fullName(test), stoppedAtBreak, error };
}

async function runTest(test, context) {
    const chain = suiteChain(test);
    for (const suite of chain) {
        for (const hook of suite.beforeAll) {
            await hook.call(context);
        }
    }
    for (const suite of chain) {
        for (const hook of suite.beforeEach) {
            await hook.call(context);
        }
    }
    await test.fn.call(context);
}
