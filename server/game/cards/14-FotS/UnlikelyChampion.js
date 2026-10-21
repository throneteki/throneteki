import DrawCard from '../../drawcard.js';

class UnlikelyChampion extends DrawCard {
    // Unlikely Champion (14040)
    // While you control a Lord or Lady character, Unlikely Champion gains a [power] icon.
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
