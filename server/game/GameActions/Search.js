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
        this.topCardsFunc = (typeof topCards === 'function') ? topCards : () => topCards;
        this.numToSelectFunc = (typeof numToSelect === 'function') ? numToSelect : () => numToSelect;
        this.playerFunc = player || (context => context.player);
        this.searchedPlayerFunc = searchedPlayer || this.playerFunc;
        this.titleFunc = (typeof title === 'function') ? title : () => title;
        this.location = location || ['draw deck'];
        this.revealGameAction = reveal ? new AbilityAdapter(RevealCards, context => ({ cards: Array.isArray(context.searchTarget) ? context.searchTarget : [context.searchTarget], player: context.player })) : null;
        this.abilityMessage = AbilityMessage.create(message);
        this.abilityCancelMessage = AbilityMessage.create(cancelMessage || '{player} does not find any cards');
    }

    message({ context }) {
        return this.gameAction.message(context);
    }

    canChangeGameState({ context }) {
        const player = this.searchedPlayerFunc(context);
        return player.drawDeck.length > 0;
    }

    createEvent({ context }) {
        const player = this.playerFunc(context);
        const searchedPlayer = this.searchedPlayerFunc(context);
        const title = this.titleFunc(context);
        const topCards = this.topCardsFunc(context);
        const numToSelect = this.numToSelectFunc(context);
        return this.event('onDeckSearched', { player, searchedPlayer, title, topCards, numToSelect }, event => {
            const revealFunc = this.createRevealDrawDeckCards({ choosingPlayer: event.player, searchedPlayer: event.searchedPlayer, numCards: event.topCards });
            const searchCondition = this.createSearchCondition(event.searchedPlayer, event.topCards, event.numToSelect);
            const modeProps = event.numToSelect ? { mode: 'upTo', numCards: event.numToSelect } : {};

            context.game.cardVisibility.addRule(revealFunc);
            context.game.promptForSelect(event.player, Object.assign(modeProps, {
                activePromptTitle: event.title,
                context: context,
                cardCondition: searchCondition,
                onSelect: (player, result) => {
                    context.gameAction = this.gameAction;
                    context.searchTarget = result;
                    context.game.cardVisibility.removeRule(revealFunc);
                    if(this.revealGameAction) {
                        let revealEvent = this.revealGameAction.createEvent(context);
                        event.thenAttachEvent(revealEvent);
                        revealEvent.thenExecute(() => {
                            this.attachGameActionEvent(revealEvent, context);
                        });
                        return true;
                    }
                    this.abilityMessage.output(context.game, { ...context, card: context.searchTarget });
                    event.thenAttachEvent(this.gameAction.createEvent(context));
                    return true;
                },
                onCancel: () => {
                    context.game.cardVisibility.removeRule(revealFunc);
                    this.abilityCancelMessage.output(context.game, context);
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

    createSearchCondition(player, topCards, numToSelect) {
        const match = Object.assign({ location: this.location, controller: player }, this.match);
        const baseMatcher = CardMatcher.createMatcher(match);
        const topCardsList = topCards ? player.searchDrawDeck(topCards) : [];

        return (card, context) => {
            if(!baseMatcher(card, context)) {
                return false;
            }

            if(topCards && !topCardsList.includes(card)) {
                return false;
            }

            const result = numToSelect ? [card] : card;

            context.searchTarget = result;
            const isActionAllowed = this.gameAction.allow(context);
            context.searchTarget = null;
            return isActionAllowed;
        };
    }

    attachGameActionEvent(revealEvent, context) {
        if(revealEvent.parent.numToSelect) {
            // Do not attach gameAction if no searchTargets are left in search location
            context.searchTarget = context.searchTarget.filter(card => this.location.includes(card.location));
            if(context.searchTarget.length === 0) {
                return;
            }
        } else if(!this.location.includes(context.searchTarget.location)) {
            // Do not attach gameAction if single searchTarget is not in search location
            context.searchTarget = null;
            return;
        }
        // TODO: change 'this.gameAction' below into SimultanousGameAction (with gameAction + revealACtion)
        this.abilityMessage.output(context.game, { ...context, card: context.searchTarget });
        revealEvent.thenAttachEvent(this.gameAction.createEvent(context));
    }
}

module.exports = Search;
