import BaseCardSelector from './BaseCardSelector.js';

class UnlimitedCardSelector extends BaseCardSelector {
    hasReachedLimit() {
        return false;
    }

    selectionToggle() {
        return {};
    }
}

export default UnlimitedCardSelector;
