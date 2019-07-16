const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class DoubtingSepta extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event =>
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.winner === this.controller
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: card => card.location === 'play area' &&
                    card.controller === this.controller && 
                    (card.getType() === 'character' || card.getType() === 'location') &&
                    card.canGainPower()
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to have {2} gain 1 power', this.controller, this, context.target);
                this.game.resolveGameAction(
                    GameActions.gainPower({ card: context.target, amount: 1 })
                );
            }
        });
    }
}

DoubtingSepta.code = '13069';

module.exports = DoubtingSepta;
