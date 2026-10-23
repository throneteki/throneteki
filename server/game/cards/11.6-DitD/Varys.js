import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Varys extends DrawCard {
    // Varys (11119)
    // Shadow (8). Stealth.
    // Reduce the cost to bring Varys out of shadows by 1 for each other card in shadows.
    // Reaction: After Varys comes out of shadows, choose and kill a character with power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('outOfShadows', (source) =>
                source.game
                    .getPlayers()
                    .reduce(
                        (acc, player) =>
                            acc + player.shadows.filter((card) => card !== source).length,
                        0
                    )
            )
        });

        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPower() > 0
            },
            message: '{player} uses {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

Varys.code = '11119';

export default Varys;
