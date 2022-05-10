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
        const allPlayers = context.game.getPlayers();
        const eventParams = {
            player,
            opponents: allPlayers.filter(p => p !== player),
            cards: Array.isArray(cards) ? cards : [cards],
            source: context.source
        }
        return this.event('onCardsRevealed', eventParams, event => {
            const whileRevealedGameAction = whileRevealed || this.defaultWhileRevealed;
            const playerRevealFunc = (card, player) => event.cards.includes(card) && player === event.player;
            const allPlayersRevealFunc = card => event.cards.includes(card);

            // Initially make cards visible to the revealing player before the actual "reveal" event. This ensures any interrupts to 'onCardRevealed' will actually show the card (eg. Alla Tyrell)
            context.game.cardVisibility.addRule(playerRevealFunc);
            
            for(let card of event.cards) {
                const revealEventParams = {
                    card,
                    cardStateWhenRevealed: card.createSnapshot(),
                    player: event.player,
                    opponents: event.opponents,
                    source: event.source
                }
                
                event.thenAttachEvent(this.event('onCardRevealed', revealEventParams, () => {}));
            }
            context = Object.assign({ revealed: event.cards, player: event.player, opponents: event.opponents }, context);

            // Highlight & reveal cards simultaneously with onCardRevealed (after interrupts)
            let prepareRevealCards = new HandlerGameActionWrapper({ handler: context => {
                    // Remove visibility for revealing player
                    context.game.cardVisibility.removeRule(playerRevealFunc);
                    // Filter out any cards that are no longer hidden (eg. Alla Tyrell)
                    context.revealed = context.revealed.filter(card => this.isInHiddenArea(card));
                    // Reveal all remaining cards to all players
                    if(context.revealed.length > 0) {
                        context.game.cardVisibility.addRule(allPlayersRevealFunc);
                        this.highlightRevealedCards(event, context.revealed, allPlayers);
                    }
                }
            });
            event.thenAttachEvent(prepareRevealCards.createEvent(context));

            let whileRevealedEvent = whileRevealedGameAction.createEvent(context);
            event.thenAttachEvent(whileRevealedEvent);
            
            whileRevealedEvent.thenExecute(() => {
                if(context.revealed.length > 0) {
                    this.hideRevealedCards(event, allPlayers);
                    context.game.cardVisibility.removeRule(allPlayersRevealFunc);
                }
            });
        });
    }

    highlightRevealedCards(event, cards, players) {
        event.preRevealSelections = {};
        for(let player of players) {
            event.preRevealSelections[player.id] = {
                selectedCards: player.selectedCards,
                selectableCards: player.selectableCards
            }

            player.clearSelectedCards();
            player.clearSelectableCards();
            player.setSelectableCards(cards);
        }
    }

    hideRevealedCards(event, players) {
        for(let player of players) {
            player.clearSelectedCards();
            player.clearSelectableCards();
            player.setSelectedCards(event.preRevealSelections[player.id].selectedCards);
            player.setSelectableCards(event.preRevealSelections[player.id].selectableCards);
        }
        event.preRevealSelections = null;
    }

    isInHiddenArea(card) {
        return ['draw deck', 'hand', 'plot deck', 'shadows'].includes(card.location);
    }
}

module.exports = new RevealCards();
