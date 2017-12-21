const DrawCard = require('../../drawcard.js');

class ShieldOfLannisport extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'lannister', trait: ['Lord', 'Lady'] });
        this.whileAttached({
            condition: () => this.noOtherLordsOrLadies(),
            effect: [
                ability.effects.modifyStrength(2),
                ability.effects.addKeyword('Renown')
            ]
        });
        this.plotModifiers({
            gold: 1
        });
    }

    noOtherLordsOrLadies() {
        return !this.controller.anyCardsInPlay(card => (
            card !== this.parent &&
            (card.hasTrait('Lord') || card.hasTrait('Lady')) &&
            card.getCost() >= 4
        ));
    }
}

ShieldOfLannisport.code = '05020';

module.exports = ShieldOfLannisport;
