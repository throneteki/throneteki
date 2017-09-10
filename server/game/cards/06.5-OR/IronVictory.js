const DrawCard = require('../../drawcard.js');

class IronVictory extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.name === 'Victarion Greyjoy',
            effect: ability.effects.dynamicStrength(() => this.getPowerOnVictarion())
        });
        this.reaction({
            when: {
                onCardSaved: event => event.card.isFaction('greyjoy') && event.card.getType() === 'character'
            },
            limit: ability.limit.perPhase(2),
            handler: context => {
                context.event.card.modifyPower(1);
                this.game.addMessage('{0} uses {1} to gain 1 power on {2}', this.controller, this, context.event.card);
            }
        });
    }

    getPowerOnVictarion() {
        let card = this.controller.findCardByName(this.controller.cardsInPlay, 'Victarion Greyjoy');

        if(!card) {
            return 0;
        }

        return card.getPower();
    }
}

IronVictory.code = '06092';

module.exports = IronVictory;
