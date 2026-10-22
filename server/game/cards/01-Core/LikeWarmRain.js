import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LikeWarmRain extends DrawCard {
    // Like Warm Rain (01158)
    // Reaction: After you lose an [intrigue] challenge as the defending player, kneel a Direwolf
    // character to choose and kill an attacking character. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.controller === event.challenge.loser &&
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.defendingPlayer === context.source.controller
            },
            max: ability.limit.perChallenge(1),
            cost: ability.costs.kneel(
                (card) => card.getType() === 'character' && card.hasTrait('Direwolf')
            ),
            target: {
                cardCondition: (card) => card.location === 'play area' && card.isAttacking(),
                gameAction: 'kill'
            },
            message: '{player} plays {source} and kneels {costs.kneel} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

LikeWarmRain.code = '01158';

export default LikeWarmRain;
