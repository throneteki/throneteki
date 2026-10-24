import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class BeyondReproach extends PlotCard {
    // Beyond Reproach (10049)
    // When Revealed: Each player sacrifices each attachment that is attached to a character he or
    // she does not control.
    setupCardAbilities() {
        this.whenRevealed({
            message:
                '{player} uses {source} to have each player sacrifice each attachment that is attached to a character they do not control',
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .filterCardsInPlay(
                        (card) =>
                            card.getType() === 'attachment' &&
                            card.parent &&
                            card.parent.getType() === 'character' &&
                            card.controller !== card.parent.controller
                    )
                    .map((card) => GameActions.sacrificeCard({ card }))
            )
        });
    }
}

BeyondReproach.code = '10049';

export default BeyondReproach;
