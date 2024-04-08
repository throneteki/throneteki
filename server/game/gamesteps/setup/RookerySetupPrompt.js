const { validateDeck, formatDeckAsShortCards, formatDeckAsFullCards } = require('../../../../deck-helper');

const AllPlayerPrompt = require('../allplayerprompt.js');

class RookerySetupPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        return player.rookeryComplete || !player.deck.rookeryCards || player.deck.rookeryCards.length === 0;
    }

    activePrompt(player) {
        return {
            menuTitle: 'Modify deck using rookery',
            buttons: [
                { text: 'Done' }
            ],
            controls: [
                { type: 'rookery', deck: formatDeckAsShortCards(player.deck) }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to finish using rookery' };
    }

    onMenuCommand(player, deck) {
        if(player.rookeryComplete) {
            return;
        }

        player.rookeryComplete = true;

        if(!deck) {
            return;
        }

        let formattedDeck = formatDeckAsFullCards(deck, { cards: this.game.cardData });
        let currentStatus = this.getStatus(player.deck);
        let newStatus = this.getStatus(formattedDeck);

        player.deck = formattedDeck;
        if(!this.haveSameCards(player.deck, formattedDeck)) {
            this.game.addMessage('danger', '{0} finishes modifying the deck using their rookery, but the deck now has cards that were not in their original deck', player);
        } else if(currentStatus !== newStatus) {
            this.game.addAlert('info', '{0} finishes modifying their deck using their rookery, but the deck is now {1} instead of {2}', player, newStatus, currentStatus);
        } else {
            this.game.addMessage('{0} finishes modifying their deck using their rookery', player);
        }
    }

    haveSameCards(deck1, deck2) {
        let deck1Cards = this.getUniqueCardCodes(deck1);
        let deck2Cards = this.getUniqueCardCodes(deck2);

        return [...deck1Cards].every(code => deck2Cards.has(code)) && [...deck2Cards].every(code => deck1Cards.has(code));
    }

    getUniqueCardCodes(deck) {
        let set = new Set();

        for(let cardQuantity of deck.drawCards) {
            set.add(cardQuantity.card.code);
        }

        for(let cardQuantity of deck.plotCards) {
            set.add(cardQuantity.card.code);
        }

        for(let cardQuantity of deck.rookeryCards) {
            set.add(cardQuantity.card.code);
        }

        if(deck.agenda) {
            set.add(deck.agenda.code);
        }

        return set;
    }

    getStatus(deck) {
        let status = validateDeck(deck, { packs: this.game.packData, restrictedLists: this.game.restrictedListData });

        if(!status.basicRules) {
            return 'Invalid';
        } else if(!status.faqJoustRules || !status.noUnreleasedCards) {
            return 'Casual Play';
        }

        return 'Valid';
    }
}

module.exports = RookerySetupPrompt;
