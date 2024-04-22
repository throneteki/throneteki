const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class NighttimeMarauders extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: event => event.card === this &&
                                           this.game.currentPhase === 'challenge'
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: card => card.controller !== this.controller && card.location === 'discard pile'
            },
            handler: context => {
                let opponent = context.target.controller;
                let cardsToDiscard = opponent.hand.filter(card => card.hasPrintedCost() && card.getPrintedCost() === context.target.getPrintedCost());
                this.game.resolveGameAction(
                            GameActions.revealCards(context => ({
                                cards: [...opponent.hand],
                                player: context.player,
                                revealWithMessage: false
                            }))
                            , context);
                opponent.discardCards(cardsToDiscard, false);
                this.game.addMessage('{0} uses {1} to choose {2} and have {3} reveal their hand: {4}', this.controller, this, context.target, opponent, opponent.hand);
                this.game.addMessage('{0} discards {1}', opponent, cardsToDiscard);
            }
        });
    }
}

NighttimeMarauders.code = '17104';

module.exports = NighttimeMarauders;
