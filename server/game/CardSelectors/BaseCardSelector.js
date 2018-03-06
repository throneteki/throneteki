const _ = require('underscore');

/**
 * Base class that represents card selection requirements and the behaviours of
 * their associated prompts.
 */
class BaseCardSelector {
    /**
     * @param {Object} properties
     * @param {Function} properties.cardCondition
     * function that takes a potential card and the ability context and returns
     * whether that card is selectable.
     * @param {(string|string[])} properties.cardType
     * either a string or array of strings indicating the type of cards allowed
     * to be selected.
     * @param {string} properties.gameAction
     * the game action checked for immunity purposes on potential target cards.
     * @param {boolean} properties.singleController
     * indicates that all cards selected must belong to the same controller.
     */
    constructor(properties) {
        this.cardCondition = properties.cardCondition;
        this.cardType = properties.cardType;
        this.gameAction = properties.gameAction;
        this.singleController = properties.singleController;

        if(!Array.isArray(properties.cardType)) {
            this.cardType = [properties.cardType];
        }
    }

    /**
     * Returns whether the specified card can be targeted.
     * @param {BaseCard} card
     * @param {AbilityContext} context
     * @returns {boolean}
     */
    canTarget(card, context) {
        return (
            this.cardType.includes(card.getType()) &&
            this.cardCondition(card, context) &&
            card.allowGameAction(this.gameAction)
        );
    }

    checkForSingleController(selectedCards, card) {
        if(!this.singleController || _.isEmpty(selectedCards)) {
            return true;
        }

        return card.controller === selectedCards[0].controller;
    }

    /**
     * Returns a list of cards that can be targeted by this selector.
     * @param {AbilityContext} context
     * @returns {BaseCard[]}
     */
    getEligibleTargets(context) {
        return context.game.allCards.filter(card => this.canTarget(card, context));
    }

    /**
     * Returns whether enough cards have been selected to fulfill the conditions
     * of the prompt.
     * @param {BaseCard[]} selectedCards
     * the currently selected cards
     * @param {integer} numPlayers
     * the number of players in the game
     * @returns {boolean}
     */
    hasEnoughSelected(selectedCards) {
        return selectedCards.length > 0;
    }

    /**
     * Returns whether there are enough valid cards to fulfill the condition of
     * the prompt.
     * @param {AbilityContext} context
     * @returns {boolean}
     */
    hasEnoughTargets(context) {
        return context.game.allCards.any(card => this.canTarget(card, context));
    }

    /**
     * Returns the default title used for this selector when prompting players.
     * @returns {string}
     */
    defaultActivePromptTitle() {
        return 'Select characters';
    }

    /**
     * Returns whether a prompt using this selector should automatically complete
     * once enough cards have been selected.
     * @returns {boolean}
     */
    automaticFireOnSelect() {
        return false;
    }

    /**
     * Returns whether adding the specified card to the current selection would
     * take the selector beyond the limits it imposes (be they the number of cards,
     * a max aggregated stat, or other criteria).
     * @param {BaseCard[]} selectedCards
     * an array of the currently selected cards
     * @param {BaseCard} card
     * the new card being considered for selection
     * @returns {boolean}
     */
    wouldExceedLimit() {
        return false;
    }

    /**
     * Returns whether the selector has reached its limit (number of cards, max
     * aggregate stat, etc) given the currently selected cards.
     * @param {BaseCard[]} selectedCards
     * @param {integer} numPlayers
     * @returns {boolean}
     */
    hasReachedLimit() {
        return false;
    }

    /**
     * Takes an array of cards and returns them in the proper format to send to
     * onSelect handlers for the prompt. By default, it just returns the array.
     * @param {BaseCard[]} cards
     * @returns {*}
     */
    formatSelectParam(cards) {
        return cards;
    }
}

module.exports = BaseCardSelector;
