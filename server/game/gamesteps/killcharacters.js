const _ = require('underscore');

const BaseStep = require('./basestep.js');

class KillCharacters extends BaseStep {
    constructor(game, cards, options) {
        super(game);

        this.cards = cards;
        this.options = options;
    }

    continue() {
        let cardsInPlay = _.filter(this.cards, card => card.location === 'play area');
        this.game.applyGameAction('killed', cardsInPlay, killable => {
            _.each(killable, card => {
                card.markAsInDanger();
            });

            this.game.raiseSimultaneousEvent(killable, {
                eventName: 'onCharactersKilled',
                params: {
                    allowSave: this.options.allowSave,
                    automaticSaveWithDupe: true,
                    isBurn: this.options.isBurn
                },
                handler: event => this.handleMultipleKills(event),
                perCardEventName: 'onCharacterKilled',
                perCardHandler: event => this.doKill(event),
                postHandler: () => this.promptForDeadPileOrder()
            });
            this.game.queueSimpleStep(() => {
                _.each(killable, card => {
                    card.clearDanger();
                });
            });
        });
    }

    handleMultipleKills(event) {
        this.event = event;

        _.each(event.cards, card => {
            this.automaticSave(card);
        });
    }

    automaticSave(card) {
        if(card.location !== 'play area') {
            this.event.saveCard(card);
        } else if(!card.canBeKilled()) {
            this.game.addMessage('{0} controlled by {1} cannot be killed',
                card, card.controller);
            this.event.saveCard(card);
        }
    }

    promptForDeadPileOrder() {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            this.promptPlayerForDeadPileOrder(player);
        });
    }

    promptPlayerForDeadPileOrder(player) {
        let cardsOwnedByPlayer = this.event.cards.filter(card => card.owner === player && card.location === 'play area');

        if(_.size(cardsOwnedByPlayer) <= 1) {
            this.moveCardsToDeadPile(cardsOwnedByPlayer);
            return;
        }

        this.game.promptForSelect(player, {
            ordered: true,
            mode: 'exactly',
            numCards: _.size(cardsOwnedByPlayer),
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
