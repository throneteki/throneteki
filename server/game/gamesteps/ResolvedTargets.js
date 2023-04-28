const {flatten, flatMap} = require('../../Array');

/**
 * Encapsulates logic around what targets have been selected during resolution
 * of an ability.
 */
class ResolvedTargets {
    constructor() {
        this.selections = [];
    }

    anySelection(predicate) {
        return this.selections.some(predicate);
    }

    setSelections(selections) {
        this.selections = selections || [];
    }

    updateTargets() {
        for(let selection of this.selections) {
            this[selection.name] = selection.value;
            if(selection.name === 'target') {
                this.defaultTarget = selection.value;
            }
        }
    }

    hasSingleTarget() {
        return this.selections.length === 1 && this.selections[0].targetingType === 'choose' && !Array.isArray(this.selections[0].value);
    }

    hasTargets() {
        return this.selections.length !== 0;
    }

    getTargets() {
        let targetingSelections = this.selections.filter(selection => selection.resolved && selection.hasValue() && selection.targetingType === 'choose');
        return flatten(targetingSelections.map(selection => selection.value));
    }

    getViewableFor(game, player) {
        let targetingSelections = this.selections.filter(selection => selection.resolved && selection.hasValue() && selection.targetingType === 'choose');
        return targetingSelections.reduce((result, selection) => {
            let cards = Array.isArray(selection.value) ? flatten(selection.value) : [selection.value];
            if(selection.requiresValidation) {
                result.viewable = result.viewable.concat(cards);
            } else {
                for(let card of cards) {
                    if(game.isCardVisible(card, player)) {
                        result.viewable.push(card);
                    } else {
                        result.hidden.push(card);
                    }
                }
            }
            return result;
        }, { viewable: [], hidden: [] });
    }

    getTargetsForPlayer(player) {
        let selectionsForPlayer = this.selections.filter(selection => selection.choosingPlayer === player);
        let result = new ResolvedTargets();
        result.setSelections(selectionsForPlayer);
        result.updateTargets();
        return result;
    }

    getSelections() {
        return this.selections.filter(selection => selection.hasValue());
    }

    getSelectionsByName(name) {
        return this.getSelections().filter(selection => selection.name === name);
    }

    getSelectedCards() {
        return flatMap(this.getSelections(), selection => selection.value);
    }

    getSelectedCardsByName(name) {
        return flatMap(this.getSelectionsByName(name), selection => selection.value);
    }
}

module.exports = ResolvedTargets;
