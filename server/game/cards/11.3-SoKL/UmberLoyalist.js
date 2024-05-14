const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class UmberLoyalist extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && this.controller.canDraw()
            },
            handler: (context) => {
                let numDrawn = context.player.drawCardsToHand(2).length;
                this.game.addMessage(
                    '{0} uses {1} to draw {2}',
                    context.player,
                    this,
                    TextHelper.count(numDrawn, 'card')
                );
            }
        });
        this.forcedInterrupt({
            when: {
                onCardLeftPlay: (event) => event.card === this && this.controller.hand.length >= 2
            },
            handler: (context) => {
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select 2 cards',
                    numCards: 2,
                    mode: 'exactly',
                    cardCondition: (card) =>
                        card.controller === context.player && card.location === 'hand',
                    onSelect: (player, cards) => this.onCardsSelected(player, cards),
                    onCancel: (player) => this.cancelResolution(player)
                });
            }
        });
    }

    onCardsSelected(player, cards) {
        player.discardCards(cards);
        this.game.addMessage('{0} is forced by {1} to discard {2}', player, this, cards);
        return true;
    }

    cancelResolution(player) {
        this.game.addAlert('danger', '{0} cancels resolution of {1}', player, this);
        return true;
    }
}

UmberLoyalist.code = '11041';

module.exports = UmberLoyalist;
