const GameAction = require('./GameAction');
const AbilityMessage = require('../AbilityMessage');
const CardMatcher = require('../CardMatcher');
const Shuffle = require('./Shuffle');

class Search extends GameAction {
    constructor({ gameAction, match, message, cancelMessage, topCards, numToSelect, title }) {
        super('search');
        this.gameAction = gameAction;
        this.match = match;
        this.topCards = topCards;
        this.numToSelect = numToSelect;
        this.title = title;
        this.message = AbilityMessage.create(message);
        this.cancelMessage = AbilityMessage.create(cancelMessage || '{player} uses {source} to search their deck but does not find a card');
    }

    canChangeGameState({ player }) {
        return player.drawDeck.length > 0;
    }

    createEvent({ player, context }) {
        return this.event('onDeckSearched', { player }, event => {
            const revealFunc = this.createRevealDrawDeckCards({ choosingPlayer: event.player, numCards: this.topCards });
            const searchCondition = this.createSearchCondition(player);
            const modeProps = this.numToSelect ? { mode: 'upTo', numCards: this.numToSelect } : {};

            context.game.cardVisibility.addRule(revealFunc);
            context.game.promptForSelect(player, Object.assign(modeProps, {
                activePromptTitle: this.title,
                context: context,
                cardCondition: searchCondition,
                onSelect: (player, result) => {
                    context.searchTarget = result;
                    this.message.output(context.game, context);
                    event.thenAttachEvent(this.gameAction.createEvent(context));
                    return true;
                },
                onCancel: () => {
                    this.cancelMessage.output(context.game, context);
                    return true;
                },
                source: context.source
            }));
            context.game.queueSimpleStep(() => {
                context.game.cardVisibility.removeRule(revealFunc);
                event.thenAttachEvent(Shuffle.createEvent({ player: event.player }));
                context.game.addMessage('{0} shuffles their deck', event.player);
            });
        });
    }

    createRevealDrawDeckCards({ choosingPlayer, numCards }) {
        return function(card, player) {
            if(player !== choosingPlayer) {
                return false;
            }

            if(numCards) {
                let cards = choosingPlayer.searchDrawDeck(numCards);
                return cards.includes(card);
            }

            return card.location === 'draw deck' && card.controller === choosingPlayer;
        };
    }

    createSearchCondition(player) {
        const match = Object.assign({ location: 'draw deck', controller: player }, this.match);
        const baseMatcher = CardMatcher.createMatcher(match);
        const topCards = this.topCards ? player.searchDrawDeck(this.topCards) : [];

        return (card, context) => {
            if(!baseMatcher(card, context)) {
                return false;
            }

            if(this.topCards && !topCards.includes(card)) {
                return false;
            }

            const result = this.numToSelect ? [card] : card;

            context.searchTarget = result;
            const isActionAllowed = this.gameAction.allow(context);
            context.searchTarget = null;
            return isActionAllowed;
        };
    }
}

module.exports = Search;
