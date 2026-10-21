import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class CerseiLannister extends DrawCard {
    // Cersei Lannister (05001)
    // Cersei Lannister does not kneel when declared as an attacker in an [intrigue] challenge.
    // Reaction: After 1 or more cards are discarded from an opponent's hand, if you do not support
    // that player, Cersei Lannister gains 1 power. (Limit 3 times per round.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.doesNotKneelAsAttacker({ challengeType: 'intrigue' })
        });
        this.reaction({
            when: {
                onCardDiscarded: {
                    aggregateBy: (event) => ({
                        controller: event.cardStateWhenDiscarded.controller,
                        location: event.cardStateWhenDiscarded.location
                    }),
                    condition: (aggregate, events, context) =>
                        aggregate.controller !== this.controller &&
                        aggregate.location === 'hand' &&
                        !context.player.isSupporter(aggregate.controller)
                }
            },
            limit: ability.limit.perRound(3),
            message: '{player} uses {source} to have {source} gain 1 power',
            gameAction: GameActions.gainPower({ card: this, amount: 1 })
        });
    }
}

CerseiLannister.code = '05001';

export default CerseiLannister;
