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

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import ServiceFactory from '../../services/ServiceFactory.js';
import { addSetupTest, attachFlow } from '../../../test/helpers/integrationhelper.js';
import { passOptionalResponses } from '../../../test/helpers/setupTest.js';
// After the test helpers, which load the engine first; loaded alone, GameActions has a cycle.
import GameActions from '../../game/GameActions/index.js';

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
 * @param {string} scenario `path/to/Card.spec.js#test name`, `report:<id>` or `file:<report.json>`
 * @param {object} options
 * @param {object[]} options.users the users who will play player1 and player2
 * @param {object} [options.router] the game node, as the game's router
 * @param {string} [options.gameId]
 * @param {object} [options.gameOptions] extra options for the Game, such as card data
 * @param {object} [options.logger]
 * @returns {Promise<{ game: import('../../game/game.js').default, name: string, stoppedAtBreak: boolean, error?: Error }>}
 */
function cardLabel(card) {
    return card.packCode ? `${card.name} (${card.packCode})` : card.name;
}

function problemReportSetup(report) {
    if (
        ![1, 2].includes(report.schemaVersion) ||
        !Array.isArray(report.players) ||
        !Array.isArray(report.cards)
    ) {
        throw new Error('Unsupported or invalid problem report');
    }

    const cardsById = new Map(report.cards.map((card) => [card.id, card]));
    const playerKeyByName = new Map(
        report.players.map((player, index) => [player.name, `player${index + 1}`])
    );
    const phase = ['plot', 'marshal', 'challenge'].includes(report.game?.phase)
        ? report.game.phase
        : 'challenge';
    const setup = {
        phase,
        firstPlayer: playerKeyByName.get(report.game?.firstPlayer) || 'player1',
        passResponses: true
    };

    for (const [index, player] of report.players.entries()) {
        const key = `player${index + 1}`;
        const names = (ids) =>
            (ids || [])
                .map((id) => cardsById.get(id))
                .filter(Boolean)
                .map(cardLabel);
        const inPlay = (player.cardsInPlay || [])
            .map((id) => cardsById.get(id))
            .filter((card) => card && !card.parent)
            .map((card) => ({
                card: cardLabel(card),
                facedown: card.facedown,
                kneeling: card.kneeled,
                power: card.power,
                gold: card.gold,
                tokens: card.tokens,
                attachments: report.cards
                    .filter(
                        (attachment) =>
                            attachment.parent === card.id && attachment.location === 'play area'
                    )
                    .map((attachment) => ({
                        card: cardLabel(attachment),
                        owner: playerKeyByName.get(attachment.owner),
                        facedown: attachment.facedown,
                        kneeling: attachment.kneeled,
                        power: attachment.power,
                        gold: attachment.gold,
                        tokens: attachment.tokens
                    }))
            }));

        setup[key] = {
            faction: player.faction || 'stark',
            plotDeck: names([player.activePlot, ...(player.plotDeck || [])]),
            usedPlots: names(player.usedPlots),
            agenda: names(player.agendas).map((card) => ({ card })),
            inPlay,
            hand: names(player.hand),
            drawDeck: names(player.drawDeck),
            discard: names(player.discardPile),
            deadPile: names(player.deadPile),
            shadows: names(player.shadows),
            outOfGame: names(player.outOfGame),
            gold: player.gold,
            power: player.power
        };
    }

    return setup;
}

function requireUsers(users, count) {
    if (users && users.length < count) {
        throw new Error(
            `This scenario has ${count} players; set SCENARIO_USERS to ${count} accounts`
        );
    }
}

async function loadStoredReport(reportId, options) {
    const report = await (
        options.problemReportService || ServiceFactory.problemReportService()
    ).getById(reportId);
    if (!report) {
        throw new Error(`Problem report "${reportId}" was not found or has expired`);
    }
    return report;
}

function loadReportFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// The game reaches the reported phase with the filler plot revealed, so the reported plots' When
// Revealed abilities, which already resolved in the reported game, don't resolve again. The
// reported plot then replaces it with the lasting effects a reveal would give it.
function placeReportedPlots(context, report) {
    const { game } = context;
    const cardsById = new Map(report.cards.map((card) => [card.id, card]));
    const players = report.players.map((_, index) => context[`player${index + 1}`]);
    const promptsBefore = players.map((player) => player.currentPrompt().menuTitle);

    report.players.forEach((reportPlayer, index) => {
        const player = context[`player${index + 1}Object`];
        const reported = cardsById.get(reportPlayer.activePlot);
        const plot =
            reported &&
            player.plotDeck.find(
                (card) =>
                    card.name === reported.name &&
                    (!reported.packCode || card.cardData.packCode === reported.packCode)
            );
        if (!plot) {
            return;
        }

        const filler = player.activePlot;
        if (filler) {
            game.resolveGameAction(GameActions.removeFromGame({ card: filler, allowSave: false }));
        }
        game.resolveGameAction(
            GameActions.placeCard({ card: plot, player, location: 'active plot' })
        );
        game.continue();

        if (filler) {
            removeHarnessCard(game, player, filler);
        }
        game.addSimultaneousEffects(
            plot.getPersistentEffects().map((properties) => ({ source: plot, properties }))
        );
    });

    game.continue();
    settlePlotPlacement(players, promptsBefore);
}

// Moving the plots raises events, so cards in the report may respond. Optional responses are
// passed and forced ordering takes the first option; any other prompt means the rebuild can't
// match the report, so it stops with an error rather than resuming in the wrong state.
function settlePlotPlacement(players, promptsBefore) {
    for (let step = 0; step < MaxSettleSteps; step++) {
        passOptionalResponses(Object.fromEntries(players.map((player, index) => [index, player])));

        const ordering = players.find((player) =>
            ForcedOrderTitle.test(player.currentPrompt().menuTitle || '')
        );
        if (!ordering) {
            break;
        }

        ordering.clickPrompt(ordering.currentPrompt().buttons[0].text);
    }

    const changed = players.find(
        (player, index) => player.currentPrompt().menuTitle !== promptsBefore[index]
    );
    if (changed) {
        throw new Error(
            `Placing the reported plots left ${changed.name} with an unexpected prompt: ` +
                `"${changed.currentPrompt().menuTitle}"`
        );
    }
}

const ForcedOrderTitle = /^Choose .+ order/;
const MaxSettleSteps = 20;

// The filler plot is a stand-in setupTest reveals to reach the phase; it was never in the reported
// game, so once it has left play through the engine it is dropped rather than left out of game.
function removeHarnessCard(game, player, card) {
    player.outOfGamePile = player.outOfGamePile.filter((other) => other !== card);
    game.allCards = game.allCards.filter((other) => other !== card);
}

// The rebuild's own log (filler plots, the scenario accounts' setup) never happened in the reported
// game, so the game shows the reported log instead.
function restoreReportedLog(game, report) {
    const messages = Array.isArray(report.messages) ? report.messages : [];

    game.gameChat.messages = messages.map((message) => ({
        ...message,
        date: new Date(message.date)
    }));
    game.logEntries = [];
    game.addAlert(
        'info',
        'Above are the last {0} messages of the reported game, which was rebuilt here from the report',
        messages.length
    );
}

function runProblemReport(report, scenario, options) {
    const numOfPlayers = report.players.length;
    requireUsers(options.users, numOfPlayers);
    const flowOptions = {
        users: options.users?.slice(0, numOfPlayers),
        numOfPlayers,
        maxPlayers: Math.max(numOfPlayers, 2),
        router: options.router,
        gameId: options.gameId,
        gameFormat: report.game?.format || 'joust',
        gameOptions: {
            manualMode: report.game?.manualMode ?? true,
            ...options.gameOptions
        },
        disableWinning: false
    };
    const context = {};
    addSetupTest(context, flowOptions);
    context.setupTest(problemReportSetup(report));
    placeReportedPlots(context, report);
    restoreReportedLog(context.game, report);
    context.game.scenario = scenario;
    context.game.round = report.game.round || context.game.round;
    restoreChallenges(context, report);
    return { game: context.game, name: `Problem report ${report.id}`, stoppedAtBreak: true };
}

const ChallengeResumePoints = {
    attackersDeclared: 'attackersDeclared',
    defendersDeclared: 'defendersDeclared',
    winnerDetermined: 'defendersDeclared'
};

function restoreChallenges(context, report) {
    const { game } = context;
    const phase = game.pipeline.getCurrentStep();
    if (report.game?.phase !== 'challenge' || !phase?.restoreChallenge) {
        return;
    }

    const players = report.players.map((player, index) => context[`player${index + 1}Object`]);
    const playerFor = (name) => players[report.players.findIndex((player) => player.name === name)];
    const cardsById = mapCardsInPlay(report, players);
    const cards = (ids) => (ids || []).map((id) => cardsById.get(id)).filter(Boolean);
    const summary = (challenge) => ({
        attackingPlayer: playerFor(challenge.attackingPlayer),
        defendingPlayer: challenge.defendingPlayer ? playerFor(challenge.defendingPlayer) : null,
        challengeType: challenge.type
    });

    for (const challenge of report.game.earlierChallenges || []) {
        phase.restoreFinishedChallenge(summary(challenge));
    }

    const challenge = report.game.currentChallenge;
    const resumeAt = challenge && ChallengeResumePoints[challenge.stage];
    if (resumeAt) {
        phase.restoreChallenge({
            ...summary(challenge),
            currentType: challenge.currentType,
            declaredAttackers: cards(challenge.declaredAttackers),
            attackers: cards(challenge.attackers),
            declaredDefenders: cards(challenge.declaredDefenders),
            defenders: cards(challenge.defenders),
            resumeAt
        });
        game.addAlert(
            'info',
            'Restored the {0} challenge at the action window after {1} were declared',
            challenge.currentType || challenge.type,
            resumeAt === 'attackersDeclared' ? 'attackers' : 'defenders'
        );
    }

    game.continue();
}

function mapCardsInPlay(report, players) {
    const cardsById = new Map(report.cards.map((card) => [card.id, card]));
    const result = new Map();
    report.players.forEach((reportPlayer, index) => {
        const available = [...players[index].cardsInPlay];
        for (const id of reportPlayer.cardsInPlay || []) {
            const name = cardsById.get(id)?.name;
            const match = available.findIndex((card) => card.name === name);
            if (match >= 0) {
                result.set(id, available.splice(match, 1)[0]);
            }
        }
    });
    return result;
}

export async function runScenario(scenario, options) {
    const logger = options.logger || console;
    if (scenario.startsWith('report:')) {
        const report = await loadStoredReport(scenario.slice('report:'.length), options);
        return runProblemReport(report, scenario, options);
    }
    if (scenario.startsWith('file:')) {
        return runProblemReport(loadReportFile(scenario.slice('file:'.length)), scenario, options);
    }
    requireUsers(options.users, 2);
    const [specPath, fragment] = scenario.split('#');
    const flowOptions = {
        users: options.users,
        router: options.router,
        gameId: options.gameId,
        gameOptions: { manualMode: true, ...options.gameOptions },
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
