import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Melisandre extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge(),
            match: (card) => card.isParticipating() && !card.isShadow(),
            targetController: 'any',
            effect: ability.effects.modifyStrength(-1)
        });

        this.action({
            title: 'Choose 1 STR or lower character',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    condition: (card) =>
                        card.getStrength() <= 1 && GameActions.putIntoShadows({ card }).allow()
                }
            },
            message: '{player} uses {source} to place {target} in shadows',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.putIntoShadows((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

Melisandre.code = '26101';

export default Melisandre;
