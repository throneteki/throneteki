import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HighgardenMinstrel extends DrawCard {
    // Highgarden Minstrel (06103)
    // Reaction: After you play a Song event, gain 1 gold. (Limit 3 times per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.hasTrait('Song') &&
                    event.card.controller === context.source.controller &&
                    context.source.controller.canGainGold()
            },
            limit: ability.limit.perRound(3),
            message: '{player} uses {source} to gain 1 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

HighgardenMinstrel.code = '06103';

export default HighgardenMinstrel;
