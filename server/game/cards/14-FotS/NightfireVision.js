import DrawCard from '../../drawcard.js';

class NightfireVision extends DrawCard {
    setupCardAbilities() {
        this.action({
            condition: () =>
                this.controller.anyCardsInPlay(
                    (card) => card.getType() === 'character' && card.hasTrait("R'hllor")
                ),
            phase: 'taxation',
            handler: (context) => {
                this.context = context;
                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Name a trait',
                        controls: [
                            { type: 'trait-name', command: 'menuButton', method: 'selectTraitName' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    selectTraitName(player, traitName) {
        this.game.addMessage('{0} plays {1} and names the {2} trait', player, this, traitName);
        this.namedTrait = traitName;

        this.game.once('onPlotsRevealed', (event) => this.handlePlotsRevealed(event));

        return true;
    }

    handlePlotsRevealed(event) {
        if (!this.namedTrait) {
            return;
        }

        let player = this.context.player;

        if (
            player.canDraw() &&
            event.plots.some((plot) => plot.controller !== player && plot.hasTrait(this.namedTrait))
        ) {
            let numCards = player.drawCardsToHand(3).length;
            this.game.addMessage(
                '{0} draws {1} cards for {2} due to a plot with trait {3} being revealed',
                player,
                numCards,
                this,
                this.namedTrait
            );
            this.namedTrait = null;
            this.context = null;
        }
    }
}

NightfireVision.code = '14024';

export default NightfireVision;
