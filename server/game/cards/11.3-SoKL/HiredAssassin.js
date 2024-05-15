import DrawCard from '../../drawcard.js';

class HiredAssassin extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                type: 'select',
                activePromptTitle: 'Select a card in shadows',
                // Technically should be able to target your own cards in shadows, it is restricted here for being
                // confusing as your own cards light up but opponent's cards (who you're targeting 99% of the time) do not.
                cardCondition: (card) =>
                    card.location === 'shadows' && card.controller !== this.controller
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to look at a card in shadows controlled by {2}',
                    context.player,
                    this,
                    context.target.controller
                );

                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select character to move to dead pile, or click done',
                    source: this,
                    revealTargets: true,
                    cardCondition: (card) => card === context.target,
                    onSelect: (player, card) => this.onCardSelected(player, card),
                    onCancel: () => this.cancelSelection()
                });
            }
        });
    }

    onCardSelected(player, card) {
        if (card.getType() === 'character') {
            card.owner.moveCard(card, 'dead pile');
            this.game.addMessage(
                "{0} places {1} into {2}'s dead pile from shadows",
                player,
                card,
                card.owner
            );
        }
        return true;
    }

    cancelSelection() {
        return true;
    }
}

HiredAssassin.code = '11053';

export default HiredAssassin;
