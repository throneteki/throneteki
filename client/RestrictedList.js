const moment = require('moment');

class RestrictedList {
    constructor(rules) {
        this.rules = rules;
    }

    validate(cards) {
        let currentRules = this.getCurrentRules();
        let joustCardsOnList = cards.filter(card => currentRules.joustCards.includes(card.code));

        let errors = [];

        if(joustCardsOnList.length > 1) {
            errors.push(`Contains more than 1 card on the FAQ v${currentRules.version} Joust restricted list: ${joustCardsOnList.map(card => card.name).join(', ')}`);
        }

        return {
            version: currentRules.version,
            valid: errors.length === 0,
            validForJoust: joustCardsOnList.length <= 1,
            errors: errors,
            joustCards: joustCardsOnList
        };
    }

    getCurrentRules() {
        let now = moment();
        return this.rules.reduce((max, list) => {
            let effectiveDate = moment(list.date, 'YYYY-MM-DD');
            if(effectiveDate <= now && effectiveDate > moment(max.date, 'YYYY-MM-DD')) {
                return list;
            }

            return max;
        });
    }
}

module.exports = RestrictedList;
