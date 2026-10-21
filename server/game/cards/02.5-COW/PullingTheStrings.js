import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class PullingTheStrings extends PlotCard {
    // Pulling the Strings (02084)
    // When Revealed: Choose an Edict, Kingdom, or Scheme plot card in an opponent's used pile.
    // Initiate the when revealed ability on that card as if you had just revealed it.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                activePromptTitle: 'Select a plot',
                cardCondition: (card, context) =>
                    card.location === 'revealed plots' &&
                    card.controller !== context.player &&
                    card.isMatch({ trait: ['Edict', 'Kingdom', 'Scheme'] }) &&
                    !!card.getWhenRevealedAbility(),
                cardType: 'plot'
            },
            message: '{player} uses {source} to initiate the When Revealed ability of {target}',
            gameAction: GameActions.initiateWhenRevealed((context) => ({ plot: context.target }))
        });
    }
}

PullingTheStrings.code = '02084';

export default PullingTheStrings;
