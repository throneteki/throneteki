const DrawCard = require('../../drawcard.js');

class AGiftOfArborRed extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal top 4 cards of each deck',
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                let opponents = this.game.getOpponents(this.controller);
                let opponentCards = opponents.map(opponent => {
                    return { player: opponent, cards: opponent.searchDrawDeck(4) };
                });

                this.revealedCards = [
                    { player: this.controller, cards: this.controller.searchDrawDeck(4) }
                ].concat(opponentCards);

                for(let revealed of this.revealedCards) {
                    this.game.addMessage('{0} uses {1} and kneels their faction card to reveal the top 4 cards of {2}\'s deck as: {3}', this.controller, this, revealed.player, revealed.cards);
                }

                this.promptToAddToHand();
            }
        });
    }

    promptToAddToHand() {
        if(this.revealedCards.length === 0) {
            return;
        }

        let currentRevealed = this.revealedCards[0];

        let title = currentRevealed.player === this.controller ? 'Choose a card to add to your hand' : `Choose a card to add to ${currentRevealed.player.name}'s hand`;
        let buttons = currentRevealed.cards.map(card => ({
            method: 'selectCardForHand', card: card
        }));

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: title,
                buttons: buttons
            },
            source: this
        });
    }

    selectCardForHand(player, cardId) {
        let current = this.revealedCards.shift();
        let card = current.cards.find(card => card.uuid === cardId);

        current.player.moveCard(card, 'hand');
        current.player.shuffleDrawDeck();

        this.game.addMessage('{0} adds {1} to {2}\'s hand and shuffles their deck',
            this.controller, card, current.player);

        this.promptToAddToHand();

        return true;
    }
}

AGiftOfArborRed.code = '02104';

module.exports = AGiftOfArborRed;
