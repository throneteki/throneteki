import PlotCard from '../../plotcard.js';

class PullingTheStrings extends PlotCard {
    // Pulling the Strings (02084)
    // When Revealed: Choose an Edict, Kingdom, or Scheme plot card in an opponent's used pile.
    // Initiate the when revealed ability on that card as if you had just revealed it.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                activePromptTitle: 'Select a plot',
                cardCondition: {
                    location: 'revealed plots',
                    controller: 'opponent',
                    trait: ['Edict', 'Kingdom', 'Scheme']
                },
                cardType: 'plot'
            },
            message: '{player} uses {source} to initiate the When Revealed ability of {target}',
            handler: (context) => {
                const whenRevealed = context.target.getWhenRevealedAbility();
                if (whenRevealed) {
                    // Attach the current When Revealed event to the new context
                    let newContext = whenRevealed.createContext(context.event);
                    newContext.player = context.player;
                    this.game.resolveAbility(whenRevealed, newContext);
                }
            }
        });
    }
}

PullingTheStrings.code = '02084';

export default PullingTheStrings;
