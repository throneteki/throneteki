import DrawCard from '../../drawcard.js';

class HouseManderlyKnight extends DrawCard {
    // House Manderly Knight (04101)
    // While there is a Winter plot card revealed, House Manderly Knight gets +2 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game
                    .getPlayers()
                    .some((player) => player.activePlot && player.activePlot.hasTrait('Winter')),
            match: this,
            effect: ability.effects.modifyStrength(2)
        });
    }
}

HouseManderlyKnight.code = '04101';

export default HouseManderlyKnight;
