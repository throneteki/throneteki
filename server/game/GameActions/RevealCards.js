const GameAction = require('./GameAction');
const HandlerGameActionWrapper = require('./HandlerGameActionWrapper');
const AcknowledgeRevealCardsPrompt = require('../gamesteps/AcknowledgeRevealCardsPrompt');

class RevealCards extends GameAction {
    constructor() {
        super('revealCards');
        this.defaultWhileRevealed = new HandlerGameActionWrapper({ handler: context => {
                if(context.revealed.length > 0) {
                    context.game.queueStep(new AcknowledgeRevealCardsPrompt(context.game, context.revealed, context.player))
                }
            }
        });
    }

    canChangeGameState({ cards }) {
        cards = Array.isArray(cards) ? cards : [cards];
        return cards.length > 0 && cards.some(card => this.isInHiddenArea(card));
    }

    createEvent({ cards, player, whileRevealed, context }) {
        const eventParams = {
            player,
            cards: Array.isArray(cards) ? cards : [cards],
            source: context.source
        }
        return this.event('onCardsRevealed', eventParams, event => {
            this.whileRevealed = whileRevealed || this.defaultWhileRevealed;
            this.playerRevealFunc = (card, player) => event.cards.includes(card) && player === event.player;
            this.allPlayersRevealFunc = card => event.cards.includes(card);
            this.revealingTo = context.game.getPlayers();
            event.opponents = this.revealingTo.filter(player => player !== event.player);

            // Initially make cards visible to the revealing player before the actual "reveal" event. This ensures any interrupts to 'onCardRevealed' will actually show the card (eg. Alla Tyrell)
            context.game.cardVisibility.addRule(this.playerRevealFunc);
            
            for(let card of event.cards) {
                const revealEventParams = {
                    card,
                    cardStateWhenRevealed: card.createSnapshot(),
                    player: event.player,
                    source: event.source
                }
                
                event.thenAttachEvent(this.event('onCardRevealed', revealEventParams, () => {}));
            }
            context = Object.assign({ revealed: event.cards, player: event.player, opponents: event.opponents }, context);

            // Highlight & reveal cards simultaneously with onCardRevealed (after interrupts)
            let prepareRevealCards = new HandlerGameActionWrapper({ handler: context => {
                    // Remove visibility for revealing player
                    context.game.cardVisibility.removeRule(this.playerRevealFunc);
                    this.playerRevealFunc = null;
                    // Filter out any cards that are no longer hidden (eg. Alla Tyrell)
                    context.revealed = context.revealed.filter(card => this.isInHiddenArea(card));
                    // Reveal all remaining cards to all players
                    if(context.revealed.length > 0) {
                        context.game.cardVisibility.addRule(this.allPlayersRevealFunc);
                        this.highlightRevealedCards(context.revealed);
                    }
                }
            });
            event.thenAttachEvent(prepareRevealCards.createEvent(context));

            let whileRevealedEvent = this.whileRevealed.createEvent(context);
            event.thenAttachEvent(whileRevealedEvent);
            
            whileRevealedEvent.thenExecute(() => {
                if(context.revealed.length > 0) {
                    this.hideRevealedCards(context.game.getPlayers());
                    context.game.cardVisibility.removeRule(this.allPlayersRevealFunc);
                }
                this.allPlayersRevealFunc = null;
            });
        });
    }

    highlightRevealedCards(cards) {
        this.previousSelectCards = {};
        for(let player of this.revealingTo) {
            this.previousSelectCards[player.uuid] = {};
            this.previousSelectCards[player.uuid].selectedCards = player.selectedCards;
            this.previousSelectCards[player.uuid].selectableCards = player.selectableCards;
            player.clearSelectedCards();
            player.clearSelectableCards();
            player.setSelectableCards(cards);
        }
    }

    hideRevealedCards() {
        for(let player of this.revealingTo) {
            player.clearSelectedCards();
            player.clearSelectableCards();

            player.setSelectedCards(this.previousSelectCards[player.uuid].selectedCards);
            player.setSelectableCards(this.previousSelectCards[player.uuid].selectableCards);
        }
        this.previousSelectCards = null;
    }

    isInHiddenArea(card) {
        return ['draw deck', 'hand', 'plot deck', 'shadows'].includes(card.location);
    }
}

module.exports = new RevealCards();
