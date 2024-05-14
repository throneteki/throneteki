import DrawCard from '../../drawcard.js';

class TheGreenblood extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.getType() === 'character' && card.isFaction('martell'),
            effect: ability.effects.dynamicStrength(() => this.numOfSummerPlotsRevealed())
        });
    }

    numOfSummerPlotsRevealed() {
        let plots = this.game
            .getPlayers()
            .filter((player) => player.activePlot && player.activePlot.hasTrait('Summer'));

        return plots.length;
    }
}

TheGreenblood.code = '04116';

export default TheGreenblood;
