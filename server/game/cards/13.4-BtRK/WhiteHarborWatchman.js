import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WhiteHarborWatchman extends DrawCard {
    // White Harbor Watchman (13061)
    // Reaction: After a character comes out of shadows, sacrifice White Harbor Watchman to kill
    // that character.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card.getType() === 'character'
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {source} to kill {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.kill((context) => ({ card: context.event.card }))
        });
    }
}

WhiteHarborWatchman.code = '13061';

export default WhiteHarborWatchman;
