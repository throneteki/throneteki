import PlotCard from '../../plotcard.js';

class CityOfSpiders extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: (context) => {
                if (this.resolving) {
                    return;
                }

                this.context = context;

                this.game.promptForSelect(context.player, {
                    cardCondition: (card) =>
                        this.isCityPlotInControllersUsedPileWithWhenRevealedAbility(
                            card,
                            context.player
                        ),
                    cardType: 'plot',
                    activePromptTitle: 'Select a plot',
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    isCityPlotInControllersUsedPileWithWhenRevealedAbility(card, player) {
        return (
            card.location === 'revealed plots' &&
            card.controller === player &&
            card.hasTrait('City') &&
            card.getWhenRevealedAbility()
        );
    }

    onCardSelected(player, card) {
        this.resolving = true;

        this.game.addMessage(
            '{0} uses {1} to initiate the When Revealed ability of {2}',
            player,
            this,
            card
        );

        let whenRevealed = card.getWhenRevealedAbility();
        if (whenRevealed) {
            // Attach the current When Revealed event to the new context
            let context = whenRevealed.createContext(this.context.event);
            this.game.resolveAbility(whenRevealed, context);
        }

        this.resolving = false;

        return true;
    }
}

CityOfSpiders.code = '13080';

export default CityOfSpiders;
