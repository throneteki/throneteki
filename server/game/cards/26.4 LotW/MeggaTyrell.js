import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MeggaTyrell extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRemovedFromChallenge: {
                    aggregateBy: (event) => ({
                        cardType: event.card.getType()
                    }),
                    condition: (aggregate) => aggregate.cardType === 'character'
                }
            },
            message: '{player} uses {source} to gain 1 power for their faction',
            gameAction: GameActions.gainPower((context) => ({
                amount: 1,
                card: context.player.faction
            })),
            limit: ability.limit.perRound(2)
        });
    }
}

MeggaTyrell.code = '26075';

export default MeggaTyrell;
