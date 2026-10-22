import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Braavos extends DrawCard {
    // Braavos (15042)
    // Marshaling Action: Kneel Braavos to gain X gold. X is the number of different factions among
    // characters you control.
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain gold',
            phase: 'marshal',
            condition: (context) => context.source.controller.canGainGold(),
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to gain {goldGained} gold',
                args: { goldGained: (context) => context.source.getNumberOfFactions() }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: context.source.getNumberOfFactions()
            }))
        });
    }

    getNumberOfFactions() {
        let charactersInPlay = this.controller.filterCardsInPlay(
            (card) => card.getType() === 'character' && !card.isFaction('neutral')
        );
        let factionsInPlay = [];

        for (let card of charactersInPlay) {
            let factions = card.getFactions();
            for (let faction of factions) {
                if (!factionsInPlay.includes(faction)) {
                    factionsInPlay.push(faction);
                }
            }
        }

        return factionsInPlay.length;
    }
}

Braavos.code = '15042';

export default Braavos;
