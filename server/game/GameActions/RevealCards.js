const GameAction = require('./GameAction');
const AckowledgeRevealCardsPrompt = require('../gamesteps/AckowledgeRevealCardsPrompt');
const CardMatcher = require('../CardMatcher');

class RevealCards extends GameAction {
    constructor({ match, revealingplayer, revealingTo, whileRevealed, gameAction }) {
        super('revealCards');
        this.match = match ? CardMatcher.createMatcher(match) : () => true;
        this.revealingPlayerFunc = revealingplayer || (context => context.player);
        this.revealingToFunc = revealingTo || (context => context.game.getPlayers());
        this.whileRevealed = whileRevealed || {};
        this.gameAction = gameAction;
    }

    canChangeGameState({ context }) {
        const cards = this.filterRevealableCards(this.match, context);
        const revealingTo = this.revealingToFunc(context);
        return cards.length > 0 && revealingTo.length > 0;
    }

    createEvent({ context }) {
        const revealingPlayer = this.revealingPlayerFunc(context); // TEST THIS WITH SINGLE PLAYER
        const revealingTo = this.revealingToFunc(context); // TEST THIS WITH SINGLE PLAYER
        const cards = this.filterRevealableCards(this.match, context);
        const eventParams = {
            revealingPlayer,
            revealingTo,
            cards,
            source: context.source
        }
        return this.event('onCardsRevealed', eventParams, event => {
            this.savePreviouslySelectedCards(event.revealingTo, event.cards);
            
            // Make the cards visible before their actual "reveal" event. This ensures any interrupts to 'onCardRevealed' will actually show the card (eg. Alla Tyrell)
            this.revealFunc = (card, player) => event.revealingTo.includes(player) && event.cards.includes(card)
            context.game.cardVisibility.addRule(this.revealFunc);


            for(let card of event.cards) {
                const thenEventParams = {
                    card,
                    cardStateWhenRevealed: card.createSnapshot(),
                    revealingPlayer,
                    revealingTo,
                    source: event.source
                }

                event.thenAttachEvent(
                    this.event('onCardRevealed', thenEventParams, thenEvent => {
                        // If the card has left the location which it was originally revealed in, then it should not be passed on
                        if(thenEvent.card.location !== thenEvent.cardStateWhenRevealed.location) {
                            event.cards = event.cards.filter(card => card !== thenEvent.card);
                        }
                    })
                );
            }
            // TODO: Open Window for all players to show whats being revealed

            context = Object.assign({ cards: event.cards, revealedPlayer: revealingPlayer, revealedTo: revealingTo }, context);
            if(this.whileRevealed.gameAction) {
                event.thenAttachEvent(this.whileRevealed.gameAction.createEvent(context));
            } else if (this.whileRevealed.handler) {
                event.thenExecute(() => this.whileRevealed.handler(context));
            } else {
                event.thenExecute(event => {
                    if(event.cards.length > 0) {
                        event.game.queueStep(new AckowledgeRevealCardsPrompt(context));
                    }
                });
            }

            event.thenExecute(() => {
                this.clearSelection(event.revealingTo);

                context.game.cardVisibility.removeRule(this.revealFunc);
                this.revealFunc = null;
            });
                
            if(this.gameAction) {
                event.thenAttachEvent(this.gameAction.createEvent(context));
            }

            
            // TODO: There's a theoretical future UI where we prominently display
            // the revealed card, add a reveal effect and pause for all players
            // to acknowledge it, etc. But until then, this event does nothing.
        });
    }
    
    filterRevealableCards(match, context) {
        return context.game.allCards.filter(card => ['draw deck', 'hand', 'plot deck', 'shadows'].includes(card.location) && match(card, context));
    }

    savePreviouslySelectedCards(players, cards) {
        this.previousSelectCards = this.previousSelectCards || {};
        for(let player of players) {
            this.previousSelectCards[player.uuid] = {};
            this.previousSelectCards[player.uuid].selectedCards = player.selectedCards;
            this.previousSelectCards[player.uuid].selectableCards = player.selectableCards;
            player.clearSelectedCards();
            player.setSelectedCards(cards);
            player.setSelectableCards(cards);
        }
    }

    clearSelection(players) {
        for(let player of players) {
            player.clearSelectedCards();
            player.clearSelectableCards();

            player.setSelectedCards(this.previousSelectCards[player.uuid].selectedCards);
            player.setSelectableCards(this.previousSelectCards[player.uuid].selectableCards);
        }
        this.previousSelectCards = null;
    }
}

module.exports = RevealCards;
