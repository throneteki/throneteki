import EachPlayerCardSelector from './CardSelectors/EachPlayerCardSelector.js';
import ExactlyXCardSelector from './CardSelectors/ExactlyXCardSelector.js';
import MaxStatCardSelector from './CardSelectors/MaxStatCardSelector.js';
import SingleCardSelector from './CardSelectors/SingleCardSelector.js';
import UnlimitedCardSelector from './CardSelectors/UnlimitedCardSelector.js';
import UpToXCardSelector from './CardSelectors/UpToXCardSelector.js';

const defaultProperties = {
    numCards: 1,
    cardCondition: () => true,
    cardType: ['attachment', 'character', 'event', 'location'],
    isCardEffect: true,
    gameAction: 'target',
    multiSelect: false,
    singleController: false,
    revealTargets: false
};

const ModeToSelector = {
    eachPlayer: (p) => new EachPlayerCardSelector(p),
    exactly: (p) => new ExactlyXCardSelector(p.numCards, p),
    maxStat: (p) => new MaxStatCardSelector(p),
    single: (p) => new SingleCardSelector(p),
    unlimited: (p) => new UnlimitedCardSelector(p),
    upTo: (p) => new UpToXCardSelector(p.numCards, p)
};

class CardSelector {
    static for(properties) {
        properties = CardSelector.getDefaultedProperties(properties);

        let factory = ModeToSelector[properties.mode];

        if (!factory) {
            throw new Error(`Unknown card selector mode of ${properties.mode}`);
        }

        return factory(properties);
    }

    static getDefaultedProperties(properties) {
        properties = Object.assign({}, defaultProperties, properties);
        properties.numCards =
            typeof properties.numCards === 'function'
                ? properties.numCards(properties.context)
                : properties.numCards;

        if (properties.mode) {
            return properties;
        }

        if (properties.maxStat) {
            properties.mode = 'maxStat';
        } else if (properties.numCards === 1 && !properties.multiSelect) {
            properties.mode = 'single';
        } else if (properties.numCards === 0) {
            properties.mode = 'unlimited';
        } else {
            properties.mode = 'upTo';
        }

        return properties;
    }
}

export default CardSelector;
