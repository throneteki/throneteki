/* eslint no-console: 0 */

import { deckBuilder } from './cards.js';
import GameFlowWrapper from './gameflowwrapper.js';
import { applySetupTest } from './setupTest.js';

const ProxiedGameFlowWrapperMethods = [
    'startGame',
    'keepStartingHands',
    'skipSetupPhase',
    'selectFirstPlayer',
    'completeMarshalPhase',
    'completeChallengesPhase',
    'completeDominancePhase',
    'completeStandingPhase',
    'completeTaxationPhase',
    'completeRound',
    'selectPlotOrder',
    'completeSetup',
    'skipActionWindow',
    'unopposedChallenge'
];

export function attachFlow(context, options) {
    context.flow = new GameFlowWrapper(options);
    context.game = context.flow.game;

    for (const player of context.flow.allPlayers) {
        context[player.key] = player;
        context[player.key + 'Object'] = player.player;
    }

    for (const method of ProxiedGameFlowWrapperMethods) {
        context[method] = (...args) => context.flow[method](...args);
    }

    context.buildDeck = (faction, cards) => deckBuilder.buildDeck(faction, cards);
}

/**
 * Gives a test context `setupTest`. `flowOptions` are passed to the GameFlowWrapper, which lets the
 * scenario runner build the same game for real users on a game node.
 */
export function addSetupTest(context, flowOptions = {}) {
    context.setupTest = (options = {}) => {
        const gameOptions = { ...flowOptions.gameOptions, ...options.gameOptions };
        attachFlow(context, {
            ...flowOptions,
            gameFormat: options.gameFormat || flowOptions.gameFormat || 'joust',
            gameOptions: { manualMode: false, ...gameOptions }
        });
        if (gameOptions.manualMode === undefined) {
            context.game.manualMode.allows = () => {
                throw new Error(
                    'The test used a manual action (a chat command, dragging a card, clicking a card with no ability to use, or changing a stat). Use real cards and prompts instead.'
                );
            };
        }
        applySetupTest(options, {
            flow: context.flow,
            deckBuilder,
            player1: context.player1,
            player2: context.player2,
            registry: context
        });
    };
    context.scenarioBreak = () => true;
}

export function install() {
    beforeEach(function () {
        addSetupTest(this);
    });

    afterEach(function () {
        if (process.env.DEBUG_TEST && this.game) {
            // The default reporter drops console output from passing tests.
            process.stdout.write(this.game.getPlainTextLog() + '\n');
        }
    });

    globalThis.integration = function (options, definitions) {
        if (typeof options === 'function') {
            definitions = options;
            options = {};
        }

        describe('integration', function () {
            beforeEach(function () {
                attachFlow(this, options);
            });

            definitions();
        });
    };
}
