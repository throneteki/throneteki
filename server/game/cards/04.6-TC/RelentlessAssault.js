import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RelentlessAssault extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.strengthDifference >= 5
            },
            message: '{player} plays {source} to kneel their faction card',
            gameAction: GameActions.kneelCard((context) => ({
                card: context.player.faction,
                source: this
            })).then({
                message: {
                    format: 'Then, {player} may initiate an additional {type} challenge this phase',
                    args: { type: (context) => context.event.challengeType }
                },
                gameAction: GameActions.genericHandler((context) => {
                    this.untilEndOfPhase((ability) => ({
                        targetController: 'current',
                        effect: ability.effects.mayInitiateAdditionalChallenge(
                            context.parentContext.event.challenge.challengeType
                        )
                    }));
                })
            })
        });
    }
}

RelentlessAssault.code = '04118';

export default RelentlessAssault;
