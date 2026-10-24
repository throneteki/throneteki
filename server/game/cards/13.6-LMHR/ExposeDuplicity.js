import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class ExposeDuplicity extends PlotCard {
    // Expose Duplicity (13120)
    // When Revealed: Discard each card in shadows.
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to discard each card in shadows',
            gameAction: GameActions.simultaneously((context) =>
                context.game.allCards
                    .filter((card) => card.location === 'shadows')
                    .map((card) => GameActions.discardCard({ card }))
            )
        });
    }
}

ExposeDuplicity.code = '13120';

export default ExposeDuplicity;
