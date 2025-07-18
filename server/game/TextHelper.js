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
    },
    /**
     * Returns the ordinal of the number provided (eg. 2 = 2nd)
     */
    ordinal(n) {
        var s = ['th', 'st', 'nd', 'rd'];
        var v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    },
    duration(sec) {
        const totalSeconds = Math.floor(sec);

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        if (minutes > 0 && seconds > 0) {
            return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        } else {
            return `${seconds} second${seconds !== 1 ? 's' : ''}`;
        }
    }
};

export default TextHelper;
