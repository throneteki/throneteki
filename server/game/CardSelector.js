const SingleCardSelector = require('./CardSelectors/SingleCardSelector');
const MaxStatCardSelector = require('./CardSelectors/MaxStatCardSelector');
const UnlimitedCardSelector = require('./CardSelectors/UnlimitedCardSelector');
const UpToXCardSelector = require('./CardSelectors/UpToXCardSelector');

const defaultProperties = {
    numCards: 1,
    cardCondition: () => true,
    cardType: ['attachment', 'character', 'event', 'location'],
    gameAction: 'target',
    multiSelect: false
};

class CardSelector {
    static for(properties) {
        properties = Object.assign({}, defaultProperties, properties);

        if(properties.maxStat) {
            return new MaxStatCardSelector(properties);
        }

        if(properties.numCards === 1 && !properties.multiSelect) {
            return new SingleCardSelector(properties);
        }

        if(properties.numCards === 0) {
            return new UnlimitedCardSelector(properties);
        }

        return new UpToXCardSelector(properties.numCards, properties);
    }
}

module.exports = CardSelector;
