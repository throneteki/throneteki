const DrawCard = require('../../drawcard.js');

class BarsenaBlackhair extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.controller.anyCardsInPlay(
                    (card) =>
                        card.parent === this &&
                        card.getType() === 'attachment' &&
                        card.hasTrait('Weapon')
                ),
            match: this,
            effect: ability.effects.modifyStrength(3)
        });
    }
}

BarsenaBlackhair.code = '15011';

module.exports = BarsenaBlackhair;
