import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BurningTheDead extends DrawCard {
    // Burning the Dead (11019)
    // Action: Remove each non-unique character in each player's dead pile from the game. Draw 1
    // card.
    setupCardAbilities() {
        this.action({
            title: 'Remove dead from game and draw 1',
            message:
                '{player} plays {source} to remove each non-unique character in each dead pile from the game and draw 1 card',
            gameAction: GameActions.simultaneously((context) => [
                ...context.game.allCards
                    .filter(
                        (card) =>
                            card.location === 'dead pile' &&
                            card.getType() === 'character' &&
                            !card.isUnique()
                    )
                    .map((card) => GameActions.removeFromGame({ card })),
                GameActions.drawCards({ player: context.player, amount: 1 })
            ])
        });
    }
}

BurningTheDead.code = '11019';

export default BurningTheDead;
