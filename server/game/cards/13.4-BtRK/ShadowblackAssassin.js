import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShadowblackAssassin extends DrawCard {
    // Shadowblack Assassin (13073)
    // Shadow (2).
    // Reaction: After Shadowblack Assassin comes out of shadows, choose and kill a character with
    // STR 1 or lower.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() <= 1
            },
            message: '{player} uses {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

ShadowblackAssassin.code = '13073';

export default ShadowblackAssassin;
