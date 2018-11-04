const BaseCardSelector = require('./BaseCardSelector.js');

class OptionalCardSelector extends BaseCardSelector {
    hasReachedLimit() {
        return false;
    }

    hasEnoughSelected() {
        // Optional selectors should always have enough cards selected, even if
        // no cards are selected at all. This will ensure that selections with
        // zero cards succeed instead of canceling the selection.
        return true;
    }

    hasEnoughTargets() {
        return true;
    }
}

module.exports = OptionalCardSelector;
