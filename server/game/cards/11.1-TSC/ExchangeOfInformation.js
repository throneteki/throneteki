const GameActions = require('../../GameActions');
const PlotCard = require('../../plotcard');

class ExchangeOfInformation extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            handler: context => {
                this.remainingCardTypes = ['character', 'location', 'attachment', 'event'];
                this.selectedCards = [];
                this.selectingOpponent = context.opponent;
                this.initiatingPlayer = context.player;

                this.game.resolveGameAction(
                    GameActions.revealTopCards({
                        player: this.controller,
                        amount: 10,
                        whileRevealed: GameActions.genericHandler(context => {
                            this.potentialCards = context.revealed;
                            this.promptForNextCardType();
                            this.game.queueSimpleStep(() => this.completeSelection());
                        }),
                        context
                    }),
                    context
                );
            }
        });
    }

    promptForNextCardType() {
        if(this.remainingCardTypes.length === 0) {
            return;
        }

        let nextType = this.remainingCardTypes.shift();
        this.promptForCardType(nextType);
    }

    promptForCardType(cardType) {
        let cards = this.potentialCards.filter(card => card.getType() === cardType);

        if(cards.length === 0) {
            this.promptForNextCardType();
            return;
        }

        let text = ['attachment', 'event'].includes(cardType) ? `an ${cardType}` : `a ${cardType}`;

        this.game.promptForSelect(this.selectingOpponent, {
            activePromptTitle: `Select ${text} for ${this.initiatingPlayer.name}`,
            cardCondition: card => this.potentialCards.includes(card) && card.getType() === cardType,
            onSelect: (player, card) => this.selectCard(player, card),
            onCancel: (player) => this.skipCard(player, cardType),
            source: this
        });
    }

    selectCard(player, card) {
        this.selectedCards.push(card);
        this.promptForNextCardType();
        return true;
    }

    skipCard(player, cardType) {
        let text = ['attachment', 'event'].includes(cardType) ? `an ${cardType}` : `a ${cardType}`;
        this.game.addAlert('danger', '{0} does not select {1} card for {2} when one is available', player, text, this);
        this.promptForNextCardType();
        return true;
    }

    completeSelection() {
        for(let card of this.selectedCards) {
            this.initiatingPlayer.moveCard(card, 'hand');
        }
        this.initiatingPlayer.shuffleDrawDeck();
        this.game.addMessage('{0} adds {1} chosen by {2} to their hand and shuffles their deck', this.initiatingPlayer, this.selectedCards, this.selectingOpponent);
    }
}

ExchangeOfInformation.code = '11020';

module.exports = ExchangeOfInformation;
