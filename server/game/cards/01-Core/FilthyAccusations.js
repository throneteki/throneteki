import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class FilthyAccusations extends PlotCard {
    // Filthy Accusations (01011)
    // When Revealed: Choose and kneel a character.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message: '{player} uses {source} to kneel {target}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.target }))
        });
    }
}

FilthyAccusations.code = '01011';

export default FilthyAccusations;
