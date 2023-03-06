const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class OneTwoThree extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ winner: this.controller, attackingPlayer: this.controller, challengeType: 'intrigue' })
            },
            cost: ability.costs.returnToHand(card => card.getType() === 'character' && card.location === 'play area'),
            // TODO: Technically the target should be choosing 2 characters, then deciding which does what; implement properly on release.
            targets: {
                insight: {
                    activePromptTitle: 'Select character to gain insight',
                    cardCondition: { type: 'character', location: 'play area' }
                },
                blank: {
                    activePromptTitle: 'Select character to blank',
                    cardCondition: { type: 'character', location: 'play area'}
                }
            },
            message: {
                format: '{player} plays {source} and returns {costs.returnToHand} to their hand to choose {targets}',
                args: { targets: context => context.targets.getTargets() }
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.simultaneously([
                        GameActions.genericHandler(context => {
                            this.untilEndOfPhase(ability => ({
                                match: context.targets.insight,
                                effect: ability.effects.addKeyword('insight')
                            }));
                        }),
                        GameActions.genericHandler(context => {
                            this.untilEndOfPhase(ability => ({
                                match: context.targets.blank,
                                effect: ability.effects.blankExcludingTraits
                            }));
                        })
                    ])
                    , context);
                    
                this.game.addMessage('{1} gains insight and {2}\'s text box is treated as if it were blank (except for Traits) until the end of the phase',
                    context.targets.insight, context.targets.blank);
            }
        });
    }
}

OneTwoThree.code = '24009';

module.exports = OneTwoThree;
