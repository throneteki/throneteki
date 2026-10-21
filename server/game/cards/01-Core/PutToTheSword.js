import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class PutToTheSword extends DrawCard {
    // Put to the Sword (01041)
    // Reaction: After you win a [military] challenge by 5 or more STR as the attacking player,
    // choose and kill a character controlled by the losing opponent. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'military' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.strengthDifference >= 5
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.event.challenge.loser &&
                    card.getType() === 'character',
                gameAction: 'kill'
            },
            message: '{player} plays {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

PutToTheSword.code = '01041';

export default PutToTheSword;
