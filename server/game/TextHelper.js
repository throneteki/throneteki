import pluralize from 'pluralize';

const TextHelper = {
    /**
     * Returns the pluralized form of the word including the count.
     *
     * TextHelper.count(1, 'card') === '1 card'
     * TextHelper.count(2, 'card') === '2 cards'
     */
    count: function (count, word) {
        return pluralize(word, count, true);
    },
    /**
     * Returns a comma-separated list with a final delimiter.
     *
     * TextHelper.formatList(['card1', 'card2'], 'or') === 'card1 or card2'
     * TextHelper.formatList(['card1', 'card2', 'card3'], 'and') === 'card1, card2 and card3'
     */
    formatList: function (wordList, finalDelimiter) {
        if (wordList.length === 0) {
            return '';
        }
        let formatted = wordList[0];
        for (let i = 1; i < wordList.length; ++i) {
            formatted += (i === wordList.length - 1 ? `, ${finalDelimiter} ` : ', ') + wordList[i];
        }
        return formatted;
    },
    /**
     * Returns the same text with the first character of each word capitalized.
     *
     * TextHelper.capitalizeFirst('this is a test') === 'This Is A Test'
     */
    capitalizeFirst: function (text) {
        return text.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
    }
};

export default TextHelper;
