import PlotCard from '../../plotcard.js';

class ASongOfSummer extends PlotCard {
    // A Song of Summer (03050)
    // While there are no Winter plot cards revealed, each character you control gets +1 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game
                    .getPlayers()
                    .every((player) => !player.activePlot || !player.activePlot.hasTrait('Winter')),
            match: (card) => card.getType() === 'character',
            effect: ability.effects.modifyStrength(1)
        });
    }
}

ASongOfSummer.code = '03050';

export default ASongOfSummer;
