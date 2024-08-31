import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Qyburn extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'dead pile',
                    not: { trait: 'Army' },
                    controller: 'opponent',
                    condition: (card, context) =>
                        GameActions.putIntoPlay({ card, player: context.player }).allow()
                }
            },
            message: '{player} uses {source} to put {target} into play under their control',
            handler: (context) => {
                context.game.resolveGameAction(
                    GameActions.putIntoPlay((context) => ({
                        card: context.target,
                        player: context.player
                    })),
                    context
                );

                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.removeFromGameIfStillInPlay(false)
                }));
            }
        });
    }
}

Qyburn.code = '25085';

export default Qyburn;
