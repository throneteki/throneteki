import PlotCard from '../../plotcard.js';

class CloseCall extends PlotCard {
    // Close Call (02120)
    // When Revealed: Move a character from your dead pile to your discard pile. Then, if there are
    // no Winter plot cards in play, draw 1 card.
    setupCardAbilities() {
        this.whenRevealed({
            handler: (context) => {
                this.game.promptForSelect(context.player, {
                    cardCondition: (card) => this.cardCondition(card, context),
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    cardCondition(card, context) {
        return (
            card.getType() === 'character' &&
            card.location === 'dead pile' &&
            card.controller === context.player
        );
    }

    onCardSelected(player, card) {
        player.moveCard(card, 'discard pile');

        this.game.addMessage('{0} uses {1} to move {2} to their discard pile', player, this, card);

        if (!this.game.anyPlotHasTrait('Winter') && player.canDraw()) {
            player.drawCardsToHand(1);
            this.game.addMessage('{0} uses {1} to draw 1 card', player, this);
        }

        return true;
    }
}

CloseCall.code = '02120';

export default CloseCall;
