const _ = require('underscore');
const UiPrompt = require('./uiprompt.js');
const CardSelector = require('../CardSelector.js');

/**
 * General purpose prompt that asks the user to select 1 or more cards.
 *
 * The properties option object has the following properties:
 * numCards           - an integer specifying the number of cards the player
 *                      must select. Set to 0 if there is no limit on the num
 *                      of cards that can be selected.
 * multiSelect        - boolean that ensures that the selected cards are sent as
 *                      an array, even if the numCards limit is 1.
 * additionalButtons  - array of additional buttons for the prompt.
 * additionalControls - array of additional controls for the prompt.
 * activePromptTitle  - the title that should be used in the prompt for the
 *                      choosing player.
 * waitingPromptTitle - the title that should be used in the prompt for the
 *                      opponent players.
 * maxStat            - a function that returns the maximum value that cards
 *                      selected by the prompt cannot exceed. If not specified,
 *                      then no stat limiting is done on the prompt.
 * cardStat           - a function that takes a card and returns a stat value.
 *                      Used for prompts that have a maximum stat value.
 * cardCondition      - a function that takes a card and should return a boolean
 *                      on whether that card is elligible to be selected.
 * cardType           - a string or array of strings listing which types of
 *                      cards can be selected. Defaults to the list of draw
 *                      card types.
 * onSelect           - a callback that is called once all cards have been
 *                      selected. On single card prompts this is called as soon
 *                      as an elligible card is clicked. On multi-select prompts
 *                      it is called when the done button is clicked. If the
 *                      callback does not return true, the prompt is not marked
 *                      as complete.
 * onMenuCommand      - a callback that is called when one of the additional
 *                      buttons is clicked.
 * onCancel           - a callback that is called when the player clicks the
 *                      done button without selecting any cards.
 * source             - what is at the origin of the user prompt, usually a card;
 *                      used to provide a default waitingPromptTitle, if missing
 * gameAction         - a string representing the game action to be checked on
 *                      target cards.
 * ordered            - an optional boolean indicating whether or not to display
 *                      the order of the selection during the prompt.
 * mustSelect         - an array of cards which must be selected.
 */
class SelectCardPrompt extends UiPrompt {
    constructor(game, choosingPlayer, properties) {
        super(game);

        this.numPlayers = this.game.getNumberOfPlayers();
        this.choosingPlayer = choosingPlayer;
        if(properties.source && !properties.waitingPromptTitle) {
            properties.waitingPromptTitle = 'Waiting for opponent to use ' + properties.source.name;
        }

        this.properties = properties;
        this.context = properties.context;
        _.defaults(this.properties, this.defaultProperties());
        this.selector = properties.selector || CardSelector.for(properties);
        this.selectedCards = [];
        this.mustSelect = properties.mustSelect || [];
        if(this.mustSelect.length > 0) {
            if(this.selector.hasReachedLimit(this.mustSelect, this.numPlayers) && this.mustSelect.length > this.selector.numCards) {
                this.onlyMustSelectMayBeChosen = true;
            } else {
                this.selectedCards = [...this.mustSelect];
                this.cannotUnselectMustSelect = true;
            }
        }
        this.revealTargets = properties.revealTargets;
        this.revealFunc = null;
        this.savePreviouslySelectedCards();
    }

    defaultProperties() {
        return {
            additionalButtons: [],
            onSelect: () => true,
            onMenuCommand: () => true,
            onCancel: () => true
        };
    }

    savePreviouslySelectedCards() {
        this.previouslySelectedCards = this.choosingPlayer.selectedCards;
        this.choosingPlayer.clearSelectedCards();
        this.choosingPlayer.setSelectedCards(this.selectedCards);
    }

    continue() {
        if(!this.isComplete()) {
            this.highlightSelectableCards();
        }

        return super.continue();
    }

    highlightSelectableCards() {
        let selectableCards = this.game.allCards.filter(card => {
            return this.checkCardCondition(card);
        });

        this.choosingPlayer.setSelectableCards(selectableCards);

        if(this.revealTargets && !this.revealFunc) {
            this.revealFunc = (card, player) => player === this.choosingPlayer && player.getSelectableCards().includes(card);
            this.game.cardVisibility.addRule(this.revealFunc);
        }
    }

    activeCondition(player) {
        return player === this.choosingPlayer;
    }

    activePrompt() {
        return {
            selectCard: true,
            selectOrder: this.properties.ordered,
            menuTitle: this.properties.activePromptTitle || this.selector.defaultActivePromptTitle(),
            buttons: this.properties.additionalButtons.concat([
                { text: this.properties.doneButtonText || 'Done', arg: 'done' }
            ]),
            controls: this.properties.additionalControls,
            promptTitle: this.properties.source ? this.properties.source.name : undefined
        };
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    onCardClicked(player, card) {
        if(player !== this.choosingPlayer) {
            return false;
        }

        if(!this.checkCardCondition(card)) {
            return false;
        }

        if(!this.selectCard(card)) {
            return false;
        }

        if(this.selector.automaticFireOnSelect() && this.selector.hasReachedLimit(this.selectedCards, this.numPlayers)) {
            this.fireOnSelect();
        }
    }

    checkCardCondition(card) {
        if(this.onlyMustSelectMayBeChosen && !this.mustSelect.includes(card)) {
            return false;
        }

        if(this.selectedCards.includes(card)) {
            return true;
        }

        return (
            this.selector.canTarget(card, this.context, this.selectedCards) &&
            this.selector.checkForSingleController(this.selectedCards, card) &&
            !this.selector.wouldExceedLimit(this.selectedCards, card)
        );
    }

    selectCard(card) {
        if(this.selector.hasReachedLimit(this.selectedCards, this.numPlayers) && !this.selectedCards.includes(card)) {
            return false;
        }

        if(!this.selectedCards.includes(card)) {
            this.selectedCards.push(card);
        } else {
            // Don't allow must-select cards to be unselected.
            if(this.cannotUnselectMustSelect && this.mustSelect.includes(card)) {
                return false;
            }

            this.selectedCards = this.selectedCards.filter(selectedCard => selectedCard !== card);

            // If unselecting this card makes other cards no longer selectable, then they need to be de-selected
            for(const remainingCard of this.selectedCards) {
                if(!this.selector.canTarget(remainingCard, this.context, this.selectedCards)) {
                    // toggle it to unselected
                    this.selectCard(remainingCard);
                }
            }
        }

        this.choosingPlayer.setSelectedCards(this.selectedCards);

        if(this.properties.onCardToggle) {
            this.properties.onCardToggle(this.choosingPlayer, card);
        }

        return true;
    }

    fireOnSelect() {
        let cardParam = this.selector.formatSelectParam(this.selectedCards);
        if(this.properties.onSelect(this.choosingPlayer, cardParam)) {
            this.complete();
        } else {
            this.clearSelection();
        }
    }

    onMenuCommand(player, arg) {
        if(player !== this.choosingPlayer) {
            return false;
        }

        if(arg !== 'done') {
            if(this.properties.onMenuCommand(player, arg)) {
                this.complete();
            }
            return;
        }

        if(this.selector.hasEnoughSelected(this.selectedCards, this.numPlayers)) {
            this.fireOnSelect();
        } else if(this.selectedCards.length === 0) {
            this.properties.onCancel(player);
            this.complete();
        }
    }

    complete() {
        this.clearSelection();
        return super.complete();
    }

    clearSelection() {
        this.selectedCards = [];
        if(this.context) {
            this.context.selectedCards = [];
        }

        this.choosingPlayer.clearSelectedCards();
        this.choosingPlayer.clearSelectableCards();

        // Restore previous selections.
        this.choosingPlayer.setSelectedCards(this.previouslySelectedCards);

        if(this.revealTargets && this.revealFunc) {
            this.game.cardVisibility.removeRule(this.revealFunc);
            this.revealFunc = null;
        }
    }

    cancelStep() {
        // Explicitly complete the prompt and thus clear player selections if
        // the prompt is cancelled.
        this.complete();
    }
}

module.exports = SelectCardPrompt;
