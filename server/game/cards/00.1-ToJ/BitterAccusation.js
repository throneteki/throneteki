import PlotCard from '../../plotcard.js';
import TextHelper from '../../TextHelper.js';

class BitterAccusation extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.controller.canDraw() &&
                    event.challenge.isMatch({
                        winner: this.controller,
                        challengeType: 'intrigue'
                    }) &&
                    this.controller.getClaim() > 0
            },
            handler: (context) => {
                let claim = context.player.getClaim();
                let cards = context.player.drawCardsToHand(claim).length;
                this.game.addMessage(
                    '{0} uses {1} to draw {2}',
                    context.player,
                    this,
                    TextHelper.count(cards, 'card')
                );

                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select a card',
                    source: this,
                    cardCondition: (card) =>
                        card.location === 'hand' && card.controller === context.player,
                    onSelect: (player, card) => this.cardSelected(player, card)
                });
            }
        });
    }

    cardSelected(player, card) {
        player.discardCard(card);
        this.game.addMessage('{0} then discards {1} for {2}', player, card, this);
        return true;
    }
}

BitterAccusation.code = '00377';

export default BitterAccusation;
