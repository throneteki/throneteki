import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class CerseiLannister extends DrawCard {
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
