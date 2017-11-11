/* global describe, beforeEach, jasmine */
/* eslint no-invalid-this: 0 */

const _ = require('underscore');

require('./objectformatters.js');

const DeckBuilder = require('./deckbuilder.js');
const GameFlowWrapper = require('./gameflowwrapper.js');

const ProxiedGameFlowWrapperMethods = [
    'startGame', 'keepStartingHands', 'skipSetupPhase', 'selectFirstPlayer',
    'completeMarshalPhase', 'completeChallengesPhase', 'completeDominancePhase',
    'selectPlotOrder', 'completeSetup',
    'skipActionWindow', 'unopposedChallenge'
];

const deckBuilder = new DeckBuilder();

var customMatchers = {
    toHavePrompt: function(util, customEqualityMatchers) {
        return {
            compare: function(actual, expected) {
                var currentTitle = actual.currentPrompt().menuTitle;
                var result = {};

                result.pass = util.equals(currentTitle, expected, customEqualityMatchers);

                if(result.pass) {
                    result.message = `Expected ${actual.name} not to have prompt "${expected}" but it did.`;
                } else {
                    result.message = `Expected ${actual.name} to have prompt "${expected}" but it had "${currentTitle}".`;
                }

                return result;
            }
        };
    },
    toHavePromptButton: function(util, customEqualityMatchers) {
        return {
            compare: function(actual, expected) {
                var buttons = actual.currentPrompt().buttons;
                var result = {};

                result.pass = _.any(buttons, button => util.equals(button.text, expected, customEqualityMatchers));

                if(result.pass) {
                    result.message = `Expected ${actual.name} not to have prompt button "${expected}" but it did.`;
                } else {
                    var buttonText = _.map(buttons, button => '[' + button.text + ']').join('\n');
                    result.message = `Expected ${actual.name} to have prompt button "${expected}" but it had buttons:\n${buttonText}`;
                }

                return result;
            }
        };
    },
    toBeControlledBy: function(util, customEqualityMatchers) {
        return {
            compare: function(actual, expected) {
                let result = {};
                let controller = actual.controller;

                result.pass = util.equals(controller.name, expected.name, customEqualityMatchers);

                if(result.pass) {
                    result.message = `Expected ${actual.name} not to be controlled by ${expected.name} but it is.`;
                } else {
                    result.message = `Expected ${actual.name} to be controlled by ${expected.name} but is controlled by ${controller.name}`;
                }

                return result;
            }
        };
    }
};

beforeEach(function() {
    jasmine.addMatchers(customMatchers);
});

global.integration = function(options, definitions) {
    if(_.isFunction(options)) {
        definitions = options;
        options = {};
    }

    describe('integration', function() {
        beforeEach(function() {
            this.flow = new GameFlowWrapper(options);

            this.game = this.flow.game;
            for(let player of this.flow.allPlayers) {
                this[player.name] = player;
                this[player.name + 'Object'] = this.game.getPlayerByName(player.name);
            }

            _.each(ProxiedGameFlowWrapperMethods, method => {
                this[method] = (...args) => this.flow[method].apply(this.flow, args);
            });

            this.buildDeck = function(faction, cards) {
                return deckBuilder.buildDeck(faction, cards);
            };
        });

        definitions();
    });
};
