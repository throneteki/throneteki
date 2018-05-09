const PlotCard = require('../../plotcard.js');

class PullingTheStrings extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: context => {
                if(this.resolving) {
                    return;
                }

                this.context = context;

                this.game.promptForSelect(this.controller, {
                    cardCondition: card => this.cardCondition(card),
                    cardType: 'plot',
                    activePromptTitle: 'Select a plot',
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    cardCondition(card) {
        return card.location === 'revealed plots' && card.controller !== this.controller && (card.hasTrait('Edict') || card.hasTrait('Kingdom') || card.hasTrait('Scheme'));
    }

    onCardSelected(player, card) {
        this.resolving = true;

        this.game.addMessage('{0} uses {1} to initiate the When Revealed ability of {2}', player, this, card);
        card.controller = player;

        let whenRevealed = card.getWhenRevealedAbility();
        if(whenRevealed) {
            // Attach the current When Revealed event to the new context
            let context = whenRevealed.createContext(this.context.event);
            this.game.resolveAbility(whenRevealed, context);
        }
        this.game.queueSimpleStep(() => {
            card.controller = card.owner;

            this.resolving = false;
        });

        return true;
    }
}

PullingTheStrings.code = '02084';

module.exports = PullingTheStrings;
