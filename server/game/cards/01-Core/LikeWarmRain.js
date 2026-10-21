import DrawCard from '../../drawcard.js';

class LikeWarmRain extends DrawCard {
    // Like Warm Rain (01158)
    // Reaction: After you lose an [intrigue] challenge as the defending player, kneel a Direwolf
    // character to choose and kill an attacking character. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.controller === event.challenge.loser &&
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.defendingPlayer === this.controller
            },
            max: ability.limit.perChallenge(1),
            cost: ability.costs.kneel(
                (card) => card.getType() === 'character' && card.hasTrait('Direwolf')
            ),
            target: {
                cardCondition: (card) => card.location === 'play area' && card.isAttacking(),
                gameAction: 'kill'
            },
            handler: (context) => {
                context.target.owner.killCharacter(context.target);
                this.game.addMessage(
                    '{0} plays {1} and kneels {2} to kill {3}',
                    context.player,
                    context.source,
                    context.costs.kneel,
                    context.target
                );
            }
        });
    }
}

LikeWarmRain.code = '01158';

export default LikeWarmRain;
