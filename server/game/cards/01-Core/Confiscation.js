import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class Confiscation extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'attachment'
            },
            message: '{player} uses {source} to discard {target}',
            gameAction: GameActions.discardCard((context) => ({ card: context.target }))
        });
    }
}

Confiscation.code = '01009';

export default Confiscation;
