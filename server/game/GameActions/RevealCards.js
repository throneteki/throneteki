const GameAction = require('./GameAction');
const HandlerGameActionWrapper = require('./HandlerGameActionWrapper');
const AcknowledgeRevealCardsPrompt = require('../gamesteps/AcknowledgeRevealCardsPrompt');
const Message = require('../Message');

class RevealCards extends GameAction {
    constructor() {
        super('revealCards');
        this.defaultWhileRevealed = new HandlerGameActionWrapper({
            handler: context => {
                if(context.revealed.length > 0) {
                    // TODO: Replace the below with a separate Card Reveal UI (and don't show the cards in their respective locations). This would clean up effects which simply reveal a single card.
                    context.game.queueStep(new AcknowledgeRevealCardsPrompt(context.game, context.revealed, context.revealingPlayer));
                }
            }
        });
    }

    allow({ cards, context }) {
        return cards.length > 0 && cards.some(card => !this.isImmune({ card, context }));
    }

    createEvent({ cards, player, whileRevealed, isCost, source, context }) {
        context.revealing = cards;
        context.revealingPlayer = player;
        const allPlayers = context.game.getPlayers();
        const eventParams = {
            player,
            cards,
            isCost,
            source: source || context.source
        };
        return this.event('onCardsRevealed', eventParams, event => {
            const whileRevealedGameAction = whileRevealed || this.defaultWhileRevealed;
            const revealFunc = card => event.revealed.includes(card) && !this.isImmune({ card, context });

            event.revealed = context.revealed = event.cards;

            // Make cards visible & print reveal message before 'onCardRevealed' to account for any reveal interrupts (eg. Alla Tyrell)
            context.game.cardVisibility.addRule(revealFunc);
            this.highlightRevealedCards(event, event.revealed, allPlayers);
            if(!isCost) {
                this.addRevealMessages(context.game, event);
            }
            
            for(let card of event.cards) {
                const revealEventParams = {
                    card,
                    cardStateWhenRevealed: card.createSnapshot(),
                    player: event.player,
                    source: event.source
                };

                event.thenAttachEvent(this.event('onCardRevealed', revealEventParams, revealEvent => {
                    if(revealEvent.card.location !== revealEvent.cardStateWhenRevealed.location) {
                        event.revealed = context.revealed = context.revealed.filter(reveal => reveal !== card);
                        for(let player of allPlayers) {
                            player.setSelectableCards(event.revealed);
                        }
                    }
                }));
            }
            let whileRevealedEvent = whileRevealedGameAction.createEvent(context);
            event.thenAttachEvent(whileRevealedEvent);

            whileRevealedEvent.thenExecute(() => {
                this.hideRevealedCards(event, allPlayers);
                context.game.cardVisibility.removeRule(revealFunc);
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

    addRevealMessages(game, event) {
        let controllers = [...new Set(event.revealed.map(card => card.controller))];
        let controllerGroups = controllers.map(controller => ({ 
            player: controller, 
            cards: event.revealed.filter(card => card.controller === controller),
            locations: [...new Set(event.revealed.filter(card => card.controller === controller).map(card => card.location))]
        }));

        if(event.player) {
            // Single player revealing all of the cards (theirs & opponents)
            let messageFragments = controllerGroups.map(group => Message.fragment(`{cards} from ${group.player === event.player ? 'their' : '{player}\'s'} {locations}`, group));
            game.addMessage('{0} reveals {1}', event.player, messageFragments, event.source);
        } else {
            // Each player reveals their own cards individually
            for(let group of controllerGroups) {
                game.addMessage('{0} reveals {1} from their {2}', group.player, group.cards, group.locations);
            }
        }
    }
}

module.exports = new RevealCards();
