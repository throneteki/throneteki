import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HarlawScout extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: {
                    aggregateBy: (event) => ({
                        controller: event.cardStateWhenDiscarded.controller,
                        source: event.source
                    }),
                    condition: (aggregate) => aggregate.source === 'reserve'
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
