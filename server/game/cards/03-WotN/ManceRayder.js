import DrawCard from '../../drawcard.js';

class ManceRayder extends DrawCard {
    // Mance Rayder (03039)
    // Renown.
    // Each Wildling character in your hand gains ambush (X). X is that card's printed cost.
    // While there is a Winter plot card revealed, reduce the cost to ambush each of your Wildling
    // characters by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'hand',
            match: (card) => card.hasTrait('Wildling'),
            effect: ability.effects.gainAmbush()
        });
        this.persistentEffect({
            condition: () =>
                this.game
                    .getPlayers()
                    .some((player) => player.activePlot && player.activePlot.hasTrait('Winter')),
            targetController: 'current',
            effect: ability.effects.reduceAmbushCardCost(1, (card) => card.hasTrait('Wildling'))
        });
    }
}

ManceRayder.code = '03039';

export default ManceRayder;
