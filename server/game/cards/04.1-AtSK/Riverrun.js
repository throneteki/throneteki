const DrawCard = require('../../drawcard.js');

class Riverrun extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerChanged: event => event.power > 0 && this.isTullyCharacter(event.card),
                onCardPowerMoved: event => event.power > 0 && this.isTullyCharacter(event.target)
            },
            cost: ability.costs.kneelSelf(),
            handler: context => {
                let tullyCharacter = context.event.card || context.event.target;
                tullyCharacter.modifyPower(1);

                this.game.addMessage('{0} kneels {1} to have {2} gain 1 power',
                    this.controller, this, tullyCharacter);
            }
        });
    }

    isTullyCharacter(card) {
        return card.getType() === 'character' && card.hasTrait('House Tully');
    }
}

Riverrun.code = '04003';

module.exports = Riverrun;
