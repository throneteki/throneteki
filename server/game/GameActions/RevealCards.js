const GameAction = require('./GameAction');
const HandlerGameActionWrapper = require('./HandlerGameActionWrapper');
const AcknowledgeRevealCardsPrompt = require('../gamesteps/AcknowledgeRevealCardsPrompt');

class RevealCards extends GameAction {
    constructor() {
        super('revealCards');
        this.defaultWhileRevealed = new HandlerGameActionWrapper({
            handler: context => {
                if(context.revealed.length > 0) {
                    // TODO: Replace the below with a separate Card Reveal UI (and don't show the cards in their respective locations). This would clean up effects which simply reveal a single card.
                    context.game.queueStep(new AcknowledgeRevealCardsPrompt(context.game, context.revealed, context.player));
                }
            }
        });
    }

    allow({ cards, context }) {
        return cards.length > 0 && cards.some(card => !this.isImmune({ card, context }))
    }

    createEvent({ cards, player, whileRevealed, context }) {
        context.player = player;
        const allPlayers = context.game.getPlayers();
        const eventParams = {
            player,
            cards,
            source: context.source
        };
        return this.event('onCardsRevealed', eventParams, event => {
            const whileRevealedGameAction = whileRevealed || this.defaultWhileRevealed;
            const revealFunc = card => context.revealed.includes(card) && !this.isImmune({ card, context });

            context.revealed = event.cards;

            // Make cards visible & print reveal message before 'onCardRevealed' to account for any reveal interrupts (eg. Alla Tyrell)
            context.game.cardVisibility.addRule(revealFunc);
            this.highlightRevealedCards(event, context.revealed, allPlayers);
            context.game.addMessage('{0} reveals {1} from their {2}', event.player, event.cards, [...new Set(event.cards.map(card => card.location))]);

            for(let card of event.cards) {
                const revealEventParams = {
                    card,
                    cardStateWhenRevealed: card.createSnapshot(),
                    player: event.player,
                    source: event.source
                };

                event.thenAttachEvent(this.event('onCardRevealed', revealEventParams, revealEvent => {
                    if(revealEvent.card.location !== revealEvent.cardStateWhenRevealed.location) {
                        this.removeInvalidReveal(context, revealEvent.card, allPlayers);
                    }
                }));
            }

            let whileRevealedEvent = whileRevealedGameAction.createEvent(context);
            event.thenAttachEvent(whileRevealedEvent);

            whileRevealedEvent.thenExecute(() => {
                this.hideRevealedCards(event, allPlayers);
                context.game.cardVisibility.removeRule(revealFunc);
                event.revealed = context.revealed; // TODO: Remove when DeckSearchPrompt is finally replaced by GameActions.Search
            });
        });
    }

    highlightRevealedCards(event, cards, players) {
        event.preRevealSelections = {};
        for(let player of players) {
            event.preRevealSelections[player.id] = {
                selectedCards: player.getSelectedCards(),
                selectableCards: player.getSelectableCards()
            };

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

    removeInvalidReveal(context, card, players) {
        context.revealed = context.revealed.filter(reveal => reveal !== card);
        for(let player of players) {
            player.setSelectableCards(context.revealed);
        }
    }
}

module.exports = new RevealCards();
