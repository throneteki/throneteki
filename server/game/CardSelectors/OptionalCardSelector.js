const BaseCardSelector = require('./BaseCardSelector.js');

class OptionalCardSelector extends BaseCardSelector {
    hasReachedLimit() {
        return false;
    }

    hasEnoughTargets() {
        return true;
    }
}

module.exports = OptionalCardSelector;
