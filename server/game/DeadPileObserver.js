class DeadPileObserver {
    constructor(game) {
        this.game = game;

        this.placements = new Map();
        this.registerEvents();
    }

    registerEvents() {
        this.game.on('onCardPlaced', event => this.registerCardPlacement({
            location: event.location,
            card: event.card 
        }));
    }

    registerCardPlacement({ location, card }) {
        if(location !== 'dead pile') {
            return;
        }

        let cardsForOwner = this.placements.get(card.owner) || [];
        this.placements.set(card.owner, cardsForOwner.concat([card]));
    }

    promptForDeadPileOrder() {
        for(const player of this.game.getPlayersInFirstPlayerOrder()) {
            this.promptPlayerForDeadPileOrder(player);
        }
        this.placements.clear();
    }

    promptPlayerForDeadPileOrder(player) {
        let cardsOwnedByPlayer = this.placements.get(player) || [];

        if(cardsOwnedByPlayer.length <= 1) {
            return;
        }

        this.game.promptForSelect(player, {
            ordered: true,
            mode: 'exactly',
            numCards: cardsOwnedByPlayer.length,
            activePromptTitle: 'Select order to place cards in dead pile (top first)',
            cardCondition: card => cardsOwnedByPlayer.includes(card),
            onSelect: (player, selectedCards) => {
                return this.rearrangeCardsInDeadPile(player, selectedCards.reverse());
            },
            onCancel: () => {
                return true;
            }
        });
    }

    rearrangeCardsInDeadPile(player, cards){
        player.updateSourceList('dead pile', cards.reduce((deadPile, card) => {
            const index = deadPile.lastIndexOf(card);
            if(index < 0) return deadPile;
            deadPile.splice(index, 1);
            return deadPile.concat([card]);
        }, player.getSourceList('dead pile')));
        return true;
    }
}

module.exports = DeadPileObserver;
