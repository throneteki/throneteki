import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HarlawScout extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: {
                    aggregateBy: (event) => [event.cardStateWhenDiscarded.controller, event.source],
                    condition: (aggregate) => aggregate[1] === 'reserve'
                }
            },
            limit: ability.limit.perRound(2),
            message: '{player} uses {source} to gain 1 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

HarlawScout.code = '24005';

export default HarlawScout;
