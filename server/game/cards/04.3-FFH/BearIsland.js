import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BearIsland extends DrawCard {
    // Bear Island (04042)
    // Reaction: After you marshal a loyal card, gain 1 gold. (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.getType() !== 'plot' &&
                    event.card.controller === context.source.controller &&
                    event.card.isLoyal() &&
                    event.playingType === 'marshal' &&
                    context.source.controller.canGainGold()
            },
            limit: ability.limit.perPhase(2),
            message: '{player} uses {source} to gain 1 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

BearIsland.code = '04042';

export default BearIsland;
