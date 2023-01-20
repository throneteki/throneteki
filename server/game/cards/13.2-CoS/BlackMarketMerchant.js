const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class BlackMarketMerchant extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: event => event.card === this
            },
            message: '{player} uses {source} to search the top 10 cards of their deck for an attachment',
            gameAction: GameActions.search({
                title: 'Select an attachment',
                topCards: 10,
                match: { type: 'attachment', printedCostOrLower: 3, controller: 'current', condition: (card, context) => this.canAttachToControlledCharacter(context.player, card) },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay(context => ({
                    card: context.searchTarget,
                    attachmentTargets: card => card.controller === context.player
                }))
            })
        });
    }

    canAttachToControlledCharacter(player, attachment) {
        return player.anyCardsInPlay(card => card.getType() === 'character' && player.canAttach(attachment, card));
    }
}

BlackMarketMerchant.code = '13033';

module.exports = BlackMarketMerchant;
