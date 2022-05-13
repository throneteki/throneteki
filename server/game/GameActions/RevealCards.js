const GameAction = require('./GameAction');
const HandlerGameActionWrapper = require('./HandlerGameActionWrapper');
const AcknowledgeRevealCardsPrompt = require('../gamesteps/AcknowledgeRevealCardsPrompt');

class RevealCards extends GameAction {
    constructor() {
        super('revealCards');
        this.defaultWhileRevealed = new HandlerGameActionWrapper({ handler: context => {
                if(context.revealed.length > 0) {
                    // TODO: Replace the below with a separate Card Reveal UI (and don't show the cards in their respective locations). This would clean up effects which simply reveal a single card.
                    context.game.queueStep(new AcknowledgeRevealCardsPrompt(context.game, context.revealed, context.player))
                }
            }
        });
    }

    canChangeGameState({ cards }) {
        return cards.length > 0 && cards.some(card => this.isInHiddenArea(card));
    }

    createEvent({ cards, player, whileRevealed, context }) {
        context.player = player;
        const allPlayers = context.game.getPlayers();
        const eventParams = {
            player,
            cards,
            source: context.source
        }
        return this.event('onCardsRevealed', eventParams, event => {
            const whileRevealedGameAction = whileRevealed || this.defaultWhileRevealed;
            const revealFunc = card => event.cards.includes(card) && this.isInHiddenArea(card);

            // Make cards visible & print reveal message before 'onCardRevealed' to account for any reveal interrupts (eg. Alla Tyrell)
            context.game.cardVisibility.addRule(revealFunc);
            this.highlightRevealedCards(event, context.revealed, allPlayers);
            context.game.addMessage("{0} reveals {1} from their {2}", event.player, event.cards, [...new Set(event.cards.map(card => card.location))]);
            
            context.revealed = [];
            event.revealed = []; // TODO: Remove when DeckSearchPrompt is finally replaced by GameActions.Search
            for(let card of event.cards) {
                const revealEventParams = {
                    card,
                    cardStateWhenRevealed: card.createSnapshot(),
                    player: event.player,
                    source: event.source
                }
                
                event.thenAttachEvent(this.event('onCardRevealed', revealEventParams, revealEvent => {
                    if(this.isInHiddenArea(revealEvent.card)) {
                        context.revealed.push(revealEvent.card);
                        event.revealed.push(revealEvent.card); // TODO: Remove when DeckSearchPrompt is finally replaced by GameActions.Search
                    }
                }));
            }
            
            let whileRevealedEvent = whileRevealedGameAction.createEvent(context);
            event.thenAttachEvent(whileRevealedEvent);
            
            whileRevealedEvent.thenExecute(() => {
                context.game.cardVisibility.removeRule(revealFunc);
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
