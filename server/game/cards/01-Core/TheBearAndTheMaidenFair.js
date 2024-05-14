import DrawCard from '../../drawcard.js';

class TheBearAndTheMaidenFair extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Look at top 5 cards of a deck',
            choosePlayer: true,
            message: "{player} plays {source} to look at the top 5 cards of {chosenPlayer}'s deck",
            handler: (context) => {
                this.selectedPlayer = context.chosenPlayer;
                this.remainingCards = this.selectedPlayer.searchDrawDeck(5);
                this.cardsPlaced = 0;
                this.mode = 'bottom';

                this.promptToPlaceNextCard();
            }
        });
    }

    promptToPlaceNextCard() {
        let buttons = this.remainingCards.map((card) => ({
            method: 'selectCard',
            card: card
        }));

        if (this.mode === 'bottom') {
            buttons.push({ text: 'Place top cards', method: 'placeTop' });
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle:
                    this.mode === 'top'
                        ? 'Choose card to place on top of deck'
                        : 'Choose card to place on bottom of deck',
                buttons: buttons
            },
            source: this
        });
    }

    selectCard(player, cardId) {
        let card = this.remainingCards.find((card) => card.uuid === cardId);

        if (!card) {
            return false;
        }

        this.remainingCards = this.remainingCards.filter((card) => card.uuid !== cardId);
        this.selectedPlayer.moveCard(card, 'draw deck', { bottom: this.mode === 'bottom' });
        this.cardsPlaced += 1;

        if (this.mode === 'bottom' && this.cardsPlaced >= 3) {
            this.placeTop();
        } else if (this.remainingCards.length > 0) {
            this.promptToPlaceNextCard();
        }

        if (this.remainingCards.length === 0) {
            this.game.addMessage(
                "{0} places {1} cards on the bottom of {2}'s deck and the rest on top",
                this.controller,
                this.cardsOnBottom,
                this.selectedPlayer
            );
        }

        return true;
    }

    placeTop() {
        this.cardsOnBottom = this.cardsPlaced;
        this.mode = 'top';
        this.cardsPlaced = 0;
        this.promptToPlaceNextCard();

        return true;
    }
}

TheBearAndTheMaidenFair.code = '01197';

export default TheBearAndTheMaidenFair;
