import DrawCard from '../../drawcard.js';

class UnlikelyChampion extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.controller.anyCardsInPlay(
                    (card) => card.hasTrait('Lord') || card.hasTrait('Lady')
                ),
            match: this,
            effect: ability.effects.addIcon('power')
        });
    }
}

UnlikelyChampion.code = '14040';

export default UnlikelyChampion;
