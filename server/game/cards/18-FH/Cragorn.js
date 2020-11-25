const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Cragorn extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search top 10 cards',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardGoldFromCard(1, card => card.getType() === 'character' && card.hasTrait('Raider') && card.controller === this.controller),
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    numCards: 10,
                    activePromptTitle: 'Select Weapon or Item attachment',
                    cardCondition: card => 
                        card.getType() === 'attachment' &&
                        card.hasPrintedCost() && 
                        card.getPrintedCost() <= 3 && 
                        this.canAttachToCardInPlay(context.player, card) &&
                        this.controller.canPutIntoPlay(card) && 
                        (card.hasTrait('Weapon') || card.hasTrait('Item')),
                    onSelect: (player, card) => this.cardSelected(player, card, context),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    canAttachToCardInPlay(player, card) {
        return this.game.anyCardsInPlay(cardInPlay => player.canAttach(card, cardInPlay));
    }

    cardSelected(player, card, context) {
        this.game.addMessage('{0} uses {1} to search their deck and put {2} into play', player, this, card);
        this.game.resolveGameAction(
            GameActions.putIntoPlay(() => ({
                card: card
            })),
            context
        );
        return true;
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not put any cards in play',
            player, this);

        return true;
    }
}

Cragorn.code = '18004';

module.exports = Cragorn;
