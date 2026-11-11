import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Sunspear extends DrawCard {
    // Sunspear (01117)
    // Reaction: After you lose a challenge as the defending player, kneel Sunspear to raise the
    // claim value on your revealed plot card by 1 during challenges of this same type until the end
    // of the phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.player &&
                    event.challenge.defendingPlayer === context.player
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to raise the claim on their plot card during {challengeType} challenges by 1 until the end of the phase',
                args: { challengeType: (context) => context.event.challenge.challengeType }
            },
            gameAction: GameActions.lastingEffect((context) => {
                const challengeType = context.event.challenge.challengeType;
                return {
                    duration: 'untilEndOfPhase',
                    condition: () => context.game.isDuringChallenge({ challengeType }),
                    match: (card) => card === context.player.activePlot,
                    effect: ability.effects.modifyClaim(1)
                };
            })
        });
    }
}

Sunspear.code = '01117';

export default Sunspear;
