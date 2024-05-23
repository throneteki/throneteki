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
                    aggregateBy: (event) => [
                        event.cardStateWhenDiscarded.controller,
                        event.cardStateWhenDiscarded.location
                    ],
                    condition: (aggregate) =>
                        aggregate[0] !== this.controller && aggregate[1] === 'hand'
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
