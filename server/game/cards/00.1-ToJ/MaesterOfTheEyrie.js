import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterOfTheEyrie extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isAttacking()
            },
            message: '{player} uses {source} to look at the top 3 cards from their deck',
            handler: (context) => {
                this.remainingCards = this.controller.searchDrawDeck(3);
                this.cardsPlaced = 0;
                this.cardsOnBottom = [];
                this.mode = 'bottom';
                this.context = context;
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
                        : 'Choose card to reveal and place on bottom of deck',
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
        this.controller.moveCard(card, 'draw deck', { bottom: this.mode === 'bottom' });
        this.cardsPlaced += 1;

        if (this.mode === 'bottom') {
            this.cardsOnBottom.push(card);
        }

        if (this.remainingCards.length > 0) {
            this.promptToPlaceNextCard();
        }

        if (this.remainingCards.length === 0) {
            this.game.addMessage(
                "{0} places {1} on the bottom of {2}'s deck and the rest on top",
                this.controller,
                this.getBottomString(),
                this.controller
            );
            this.game.resolveGameAction(
                GameActions.revealCards((context) => ({
                    cards: this.cardsOnBottom,
                    player: player
                })),
                this.context
            );
        }

        return true;
    }

    placeTop() {
        this.mode = 'top';
        this.cardsPlaced = 0;
        this.promptToPlaceNextCard();

        return true;
    }

    getBottomString() {
        if (this.cardsOnBottom.length > 0) {
            return `${this.cardsOnBottom.length} cards`;
        }
        return 'no cards';
    }
}

MaesterOfTheEyrie.code = '00346';

export default MaesterOfTheEyrie;
