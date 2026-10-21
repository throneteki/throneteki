import DrawCard from '../../drawcard.js';

class TheGreenblood extends DrawCard {
    // The Greenblood (04116)
    // Each [martell] character you control gets +1 STR for each Summer plot card revealed.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.getType() === 'character' && card.isFaction('martell'),
            effect: ability.effects.dynamicStrength((card, context) =>
                context.source.numOfSummerPlotsRevealed()
            )
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
