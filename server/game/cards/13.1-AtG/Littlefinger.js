import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class Littlefinger extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) =>
                    event.card.controller === this.controller &&
                    event.card.getType() === 'character'
            },
            limit: ability.limit.perRound(1),
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to select up to 3 cards from their hand',
                    context.player,
                    this
                );
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select up to 3 cards',
                    numCards: 3,
                    cardCondition: (card) =>
                        card.controller === context.player && card.location === 'hand',
                    onSelect: (player, cards) => this.onCardsSelected(player, cards),
                    onCancel: (player) => this.cancelResolution(player)
                });
            }
        });
    }

    onCardsSelected(player, cards) {
        this.remainingCards = cards;
        this.numSelectedCards = cards.length;
        this.promptToPlaceNextCard(cards);
        return true;
    }

    promptToPlaceNextCard() {
        if (this.remainingCards.length === 0) {
            return true;
        }

        let buttons = this.remainingCards.map((card) => ({
            method: 'selectCardForBottom',
            card: card
        }));

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Choose card to place on bottom of deck',
                buttons: buttons
            },
            source: this
        });

        return true;
    }

    selectCardForBottom(player, cardId) {
        let card = this.remainingCards.find((card) => card.uuid === cardId);
        if (!card) {
            return false;
        }

        this.remainingCards = this.remainingCards.filter((card) => card.uuid !== cardId);
        this.controller.moveCard(card, 'draw deck', { bottom: true });

        if (this.remainingCards.length > 0) {
            this.promptToPlaceNextCard();
        } else {
            let drawnCards = player.drawCardsToHand(this.numSelectedCards);
            this.game.addMessage(
                '{0} places {1} on bottom of their deck to draw {2}',
                player,
                TextHelper.count(this.numSelectedCards, 'card'),
                TextHelper.count(drawnCards.length, 'card')
            );
        }

        return true;
    }

    cancelResolution(player) {
        this.game.addAlert('danger', '{0} cancels resolution of {1}', player, this);
        return true;
    }
}

Littlefinger.code = '13017';

export default Littlefinger;
