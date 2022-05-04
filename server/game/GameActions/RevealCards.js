const GameAction = require('./GameAction');
const ChooseGameAction = require('./ChooseGameAction');
const HandlerGameActionWrapper = require('./HandlerGameActionWrapper');
const AckowledgeRevealCardsPrompt = require('../gamesteps/AckowledgeRevealCardsPrompt');

class RevealCards extends GameAction {
    constructor({ cards, player, whileRevealed }) {
        super('revealCards');
        this.cards = Array.isArray(cards) ? cards : [cards];
        this.player = player;
        this.whileRevealedGameAction = this.buildGameAction(whileRevealed);
    }

    canChangeGameState({ cards }) {
        cards = Array.isArray(cards) ? cards : [cards];
        return cards.length > 0 && cards.some(card => ['draw deck', 'hand', 'plot deck', 'shadows'].includes(card.location));
    }

    createEvent({ cards, player, context }) {
        const eventParams = {
            revealingPlayer: player,
            cards: Array.isArray(cards) ? cards : [cards],
            source: context.source
        }
        return this.event('onCardsRevealed', eventParams, event => {
            // this.savePreviouslySelectedCards(context.game, event.cards);
            
            // Make the cards visible before their actual "reveal" event. This ensures any interrupts to 'onCardRevealed' will actually show the card (eg. Alla Tyrell)
            this.revealFunc = card => event.cards.includes(card);
            context.game.cardVisibility.addRule(this.revealFunc);

            for(let card of event.cards) {
                const thenEventParams = {
                    card,
                    cardStateWhenRevealed: card.createSnapshot(),
                    revealingPlayer: event.revealingPlayer,
                    source: event.source
                }
                
                event.thenAttachEvent(
                    this.event('onCardRevealed', thenEventParams, () => {})
                );
            }
            // TODO: Open Window for all players to show whats being revealed

            context = Object.assign({ cards: event.cards, revealingPlayer: event.revealingPlayer }, context);
            
            event.thenAttachEvent(this.whileRevealedGameAction.createEvent(context));
            
            context.game.queueSimpleStep(() => {
                // this.clearSelection(context.game);
                context.game.cardVisibility.removeRule(this.revealFunc);
                this.revealFunc = null;
            });
        });
    }

    savePreviouslySelectedCards(game, cards) {
        this.previousSelectCards = this.previousSelectCards || {};
        for(let player of game.getPlayers()) {
            this.previousSelectCards[player.uuid] = {};
            this.previousSelectCards[player.uuid].selectedCards = player.selectedCards;
            this.previousSelectCards[player.uuid].selectableCards = player.selectableCards;
            player.clearSelectedCards();
            player.setSelectedCards(cards);
            player.setSelectableCards(cards);
        }
    }

    clearSelection(game) {
        for(let player of game.getPlayers()) {
            player.clearSelectedCards();
            player.clearSelectableCards();

            player.setSelectedCards(this.previousSelectCards[player.uuid].selectedCards);
            player.setSelectableCards(this.previousSelectCards[player.uuid].selectableCards);
        }
        this.previousSelectCards = null;
    }

    buildGameAction(whileRevealed) {
        if(!whileRevealed) {
            return new HandlerGameActionWrapper({ handler: context => context.game.queueStep(new AckowledgeRevealCardsPrompt(context.game, context.cards, context.revealingPlayer)) });
        }
        if(whileRevealed.gameAction) {
            return whileRevealed.gameAction;
        }

        if(whileRevealed.choices) {
            return new ChooseGameAction(whileRevealed.choices);
        }

        if(whileRevealed.handler) {
            return new HandlerGameActionWrapper({ handler: whileRevealed.handler });
        }

        throw new Error('Cannot use whileRevealed without specifying a gameAction, choices or handler');
    }
}

module.exports = RevealCards;
