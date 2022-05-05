const GameAction = require('./GameAction');
const AbilityAdapter = require('./AbilityAdapter');
const AbilityMessage = require('../AbilityMessage');
const RevealCards = require('./RevealCards');
const CardMatcher = require('../CardMatcher');
const Shuffle = require('./Shuffle');

class Search extends GameAction {
    constructor({ gameAction, location, match, message, cancelMessage, topCards, numToSelect, player, searchedPlayer, title, reveal = true }) {
        super('search');
        this.gameAction = gameAction;
        this.match = match || {};
        this.topCards = topCards;
        this.numToSelect = numToSelect;
        this.playerFunc = player || (context => context.player);
        this.searchedPlayerFunc = searchedPlayer || this.playerFunc;
        this.title = title;
        this.location = location || ['draw deck'];
        this.reveal = reveal;
        this.message = AbilityMessage.create(message);
        this.cancelMessage = AbilityMessage.create(cancelMessage || '{player} uses {source} to search their deck but does not find a card');
    }

    canChangeGameState({ context }) {
        const player = this.searchedPlayerFunc(context);
        return player.drawDeck.length > 0;
    }

    createEvent({ context }) {
        const player = this.playerFunc(context);
        const searchedPlayer = this.searchedPlayerFunc(context);
        return this.event('onDeckSearched', { player, searchedPlayer }, event => {
            const revealFunc = this.createRevealDrawDeckCards({ choosingPlayer: event.player, searchedPlayer: event.searchedPlayer, numCards: this.topCards });
            const searchCondition = this.createSearchCondition(event.searchedPlayer);
            const modeProps = this.numToSelect ? { mode: 'upTo', numCards: this.numToSelect } : {};

            context.game.cardVisibility.addRule(revealFunc);
            context.game.promptForSelect(event.player, Object.assign(modeProps, {
                activePromptTitle: this.title,
                context: context,
                cardCondition: searchCondition,
                onSelect: (player, result) => {
                    context.searchTarget = result;
                    context.game.cardVisibility.removeRule(revealFunc);
                    this.message.output(context.game, context);
                    if(this.reveal) {
                        this.revealGameAction = new AbilityAdapter(RevealCards, context => ({ cards: context.searchTarget, player: context.player }));
                        event.thenAttachEvent(this.revealGameAction.createEvent(context));
                    }
                    event.thenAttachEvent(this.gameAction.createEvent(context));
                    return true;
                },
                onCancel: () => {
                    this.cancelMessage.output(context.game, context);
                    return true;
                },
                source: context.source
            }));
            event.thenExecute(() => {
                event.thenAttachEvent(Shuffle.createEvent({ player: event.searchedPlayer }));
                context.game.addMessage('{0} shuffles their deck', event.searchedPlayer);
            });
        });
    }

    createRevealDrawDeckCards({ choosingPlayer, searchedPlayer, numCards }) {
        const validLocations = this.location;
        return function(card, player) {
            if(player !== choosingPlayer) {
                return false;
            }

            if(numCards) {
                let cards = choosingPlayer.searchDrawDeck(numCards);
                return cards.includes(card);
            }

            return validLocations.includes(card.location) && card.controller === searchedPlayer;
        };
    }

    createSearchCondition(player) {
        const match = Object.assign({ location: this.location, controller: player }, this.match);
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
