import DrawCard from '../../drawcard.js';

class ManceRayder extends DrawCard {
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
