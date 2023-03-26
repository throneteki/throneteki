const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class OneTwoThree extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({
                    winner: this.controller,
                    challengeType: 'intrigue',
                    by5: true
                })
            },
            // TODO: Technically the target should be choosing 3 characters, then deciding which does what. Implement properly later.
            targets: {
                hand: {
                    activePromptTitle: 'Select character to return to hand',
                    cardCondition: { type: 'character', controller: 'current' }
                },
                shadows: {
                    activePromptTitle: 'Select character to place into shadows',
                    cardCondition: { type: 'character', controller: 'current' }
                },
                insight: {
                    activePromptTitle: 'Select character to gain insight',
                    cardCondition: { type: 'character', controller: 'current' }
                }
            },
            max: ability.limit.perPhase(1),
            message: {
                format: '{player} plays {source} to choose {targets}',
                args: { targets: context => context.targets.getTargets() }
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.simultaneously([
                        GameActions.returnCardToHand(context => ({ card: context.targets.hand })),
                        GameActions.putIntoShadows(context => ({ card: context.targets.shadows })),
                        GameActions.genericHandler(context => {
                            this.untilEndOfPhase(ability => ({
                                match: context.targets.insight,
                                effect: ability.effects.addKeyword('insight')
                            }));
                        })
                    ])
                    , context);
                    
                this.game.addMessage('{0} returns {1} to it\'s owners hand, places {2} into shadows and has {3} gain insight until the end of the phase',
                    this.controller, context.targets.hand, context.targets.shadows, context.targets.insight);
            }
        });
    }
}

OneTwoThree.code = '24009';

module.exports = OneTwoThree;
