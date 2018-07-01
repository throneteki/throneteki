const pluralize = require('pluralize');

const TextHelper = {
    /**
     * Returns the pluralized form of the word including the count.
     *
     * TextHelper.count(1, 'card') === '1 card'
     * TextHelper.count(2, 'card') === '2 cards'
     */
    count: function(count, word) {
        return pluralize(word, count, true);
    }
};

module.exports = TextHelper;
