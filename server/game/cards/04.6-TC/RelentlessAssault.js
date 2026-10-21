import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RelentlessAssault extends DrawCard {
    // Relentless Assault (04118)
    // Reaction: After you win a challenge by 5 or more STR as the attacking player, kneel your
    // faction card. Then, you may initiate an additional challenge of that type this phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.attackingPlayer === context.player &&
                    event.challenge.strengthDifference >= 5
            },
            message: '{player} plays {source} to kneel their faction card',
            gameAction: GameActions.kneelCard((context) => ({
                card: context.player.faction
            })).then({
                message: {
                    format: 'Then, {player} may initiate an additional {type} challenge this phase',
                    args: { type: (context) => context.parentContext.event.challenge.challengeType }
                },
                gameAction: GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    targetController: 'any',
                    match: (player) => player === context.player,
                    effect: ability.effects.mayInitiateAdditionalChallenge(
                        context.parentContext.event.challenge.challengeType
                    )
                }))
            })
        });
    }
}

RelentlessAssault.code = '04118';

export default RelentlessAssault;
