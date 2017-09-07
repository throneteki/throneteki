const DrawCard = require('../../drawcard.js');

class Riverrun extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerChanged: event => (
                    event.power > 0 &&
                    event.card.getType() === 'character' &&
                    event.card.hasTrait('House Tully')
                )
            },
            cost: ability.costs.kneelSelf(),
            handler: context => {
                let tullyCharacter = context.event.card;
                tullyCharacter.modifyPower(1);

                this.game.addMessage('{0} kneels {1} to have {2} gain 1 power',
                    this.controller, this, tullyCharacter);
            }
        });
    }
}

Riverrun.code = '04003';

module.exports = Riverrun;
