const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class OneTwoThree extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({
                    winner: this.controller,
                    challengeType: 'intrigue',
                    by5: true
                })
            },
            target: {
                cardCondition: { location: 'play area', type: 'character', controller: 'current' }
            },
            choices: {
                'Return to hand': {
                    message: '{player} plays {source} to return {target} to it\'s owners hand',
                    gameAction: GameActions.returnCardToHand(context => ({ card: context.target }))
                },
                'Place in shadows': {
                    message: '{player} plays {source} to place {target} in shadows',
                    gameAction: GameActions.putIntoShadows(context => ({ card: context.target }))
                },
                'Gain insight': {
                    message: '{player} plays {source} to have {target} gain insight until the end of the phase',
                    gameAction: GameActions.genericHandler(context => {
                        this.untilEndOfPhase(ability => ({
                            match: context.targets.insight,
                            effect: ability.effects.addKeyword('insight')
                        }));
                    })
                }
            }
        });
    }
}

OneTwoThree.code = '24009';

module.exports = OneTwoThree;
