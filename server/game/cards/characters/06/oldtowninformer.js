const DrawCard = require('../../../drawcard.js');

class OldtownInformer extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: () => this.game.currentPhase === 'challenge' && this.tokens['gold'] >= 1
            },
            handler: () => {
                this.controller.drawCardsToHand(this.tokens['gold']);
                this.game.addMessage('{0} uses {1} to draw {2} cards', this.controller, this, this.tokens['gold']);

                this.game.promptForSelect(this.controller, {
                    numCards: this.tokens['gold'],
                    multiSelect: true,
                    activePromptTitle: 'Select ' + this.tokens['gold'] + ' cards',
                    source: this,
                    cardCondition: card => card.location === 'hand' && card.controller === this.controller,
                    onSelect: (player, cards) => this.cardsSelected(player, cards)
                });
            }
        });
    }

    cardsSelected(player, cards) {
        if(cards.length !== this.tokens['gold']) {
            return false;
        }

        player.discardCards(cards);
        this.game.addMessage('{0} then discards {1} for {2}', this.controller, cards, this);
        return true;
    }
}

OldtownInformer.code = '06063';

module.exports = OldtownInformer;
