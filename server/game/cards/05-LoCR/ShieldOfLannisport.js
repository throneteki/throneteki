import DrawCard from '../../drawcard.js';

class ShieldOfLannisport extends DrawCard {
    // Shield of Lannisport (05020)
    // [lannister] Lord or Lady character only.
    // While you control no Lord or Lady characters with printed cost 4 or higher other than
    // attached character, attached character gets +2 STR and gains renown.
    // +1 Income.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'lannister', trait: ['Lord', 'Lady'] });
        this.whileAttached({
            condition: () => this.noOtherLordsOrLadies(),
            effect: [ability.effects.modifyStrength(2), ability.effects.addKeyword('Renown')]
        });
        this.plotModifiers({
            gold: 1
        });
    }

    noOtherLordsOrLadies() {
        return !this.controller.anyCardsInPlay(
            (card) =>
                card !== this.parent &&
                (card.hasTrait('Lord') || card.hasTrait('Lady')) &&
                card.getPrintedCost() >= 4
        );
    }
}

ShieldOfLannisport.code = '05020';

export default ShieldOfLannisport;
