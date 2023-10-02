const BaseStep = require('./basestep.js');

class KillCharacters extends BaseStep {
    constructor(game, cards, options) {
        super(game);

        this.cards = cards;
        this.options = options;
    }

    continue() {
        let cardsInPlay = this.cards.filter(card => card.location === 'play area');
        this.game.applyGameAction('kill', cardsInPlay, killable => {
            for(let card of killable) {
                card.markAsInDanger();
            }

            this.game.raiseSimultaneousEvent(killable, {
                eventName: 'onCharactersKilled',
                params: {
                    allowSave: this.options.allowSave,
                    automaticSaveWithDupe: true,
                    isBurn: this.options.isBurn,
                    snapshots: killable.map(card => card.createSnapshot())
                },
                handler: event => this.handleMultipleKills(event),
                perCardEventName: 'onCharacterKilled',
                perCardHandler: event => this.doKill(event),
                postHandler: () => this.promptForDeadPileOrder()
            });
            this.game.queueSimpleStep(() => {
                for(let card of killable) {
                    card.clearDanger();
                }
            });
        }, { force: this.options.force });
    }

    handleMultipleKills(event) {
        this.event = event;

        for(let card of event.cards) {
            this.automaticSave(card);
        }
    }

    automaticSave(card) {
        if(card.location !== 'play area') {
            this.event.saveCard(card);
        } else if(!card.canBeKilled() && !this.options.force) {
            this.game.addMessage('{0} controlled by {1} cannot be killed',
                card, card.controller);
            this.event.saveCard(card);
        }
    }

    promptForDeadPileOrder() {
        for(let player of this.game.getPlayersInFirstPlayerOrder()) {
            this.promptPlayerForDeadPileOrder(player);
        }
    }

    promptPlayerForDeadPileOrder(player) {
        let cardsOwnedByPlayer = this.event.cards.filter(card => card.owner === player && card.location === 'play area');

        if(cardsOwnedByPlayer.length <= 1) {
            this.moveCardsToDeadPile(cardsOwnedByPlayer);
            return;
        }

        this.game.promptForSelect(player, {
            ordered: true,
            mode: 'exactly',
            numCards: cardsOwnedByPlayer.length,
            activePromptTitle: 'Select order to place cards in dead pile (top first)',
            cardCondition: card => cardsOwnedByPlayer.includes(card),
            onSelect: (player, selectedCards) => {
                this.moveCardsToDeadPile(selectedCards.reverse());

                return true;
            },
            onCancel: () => {
                this.moveCardsToDeadPile(cardsOwnedByPlayer);
                return true;
            }
        });
    }

    moveCardsToDeadPile(cards) {
        for(let card of cards) {
            card.owner.moveCard(card, 'dead pile');
        }
    }

    doKill(event) {
        let card = event.card;
        let player = card.controller;

        if(card.location !== 'play area') {
            event.cancel();
            return;
        }

        event.cardStateWhenKilled = card.createSnapshot();
        this.game.addMessage('{0} kills {1}', player, card);
    }
}

module.exports = KillCharacters;
