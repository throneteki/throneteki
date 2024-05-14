import BaseCardSelector from './BaseCardSelector.js';

class UnlimitedCardSelector extends BaseCardSelector {
    hasReachedLimit() {
        return false;
    }
}

export default UnlimitedCardSelector;
