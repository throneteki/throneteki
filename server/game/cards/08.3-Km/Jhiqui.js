const DrawCard = require('../../drawcard.js');

class Jhiqui extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) => event.challenge.winner === this.controller
            },
            cost: ability.costs.discardFromHand(),
            target: {
                type: 'select',
                gameAction: 'gainPower',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isParticipating() &&
                    (card.hasTrait('Lord') || card.hasTrait('Lady'))
            },
            handler: (context) => {
                context.target.modifyPower(1);
                this.game.addMessage(
                    '{0} uses {1} and discards {2} to have {3} gain 1 power',
                    this.controller,
                    this,
                    context.costs.discardFromHand,
                    context.target
                );
            }
        });
    }
}

Jhiqui.code = '08053';

module.exports = Jhiqui;
