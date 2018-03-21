const moment = require('moment');

const rules = [
    {
        version: '1.1',
        date: '2016-10-10',
        joustCards: []
    },
    {
        version: '1.2',
        date: '2017-10-12',
        joustCards: []
    },
    {
        version: '1.3',
        date: '2018-03-26',
        joustCards: [
            '01045', // The Hand's Judgment
            '05010', // Taena Merryweather
            '06040', // The Annals of Castle Black
            '06100', // Wheels Within Wheels
            '06103' //  Highgarden Minstrel
        ]
    }
];

class RestrictedList {
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
        return rules.reduce((max, list) => {
            let effectiveDate = moment(list.date, 'YYYY-MM-DD');
            if(effectiveDate <= now && effectiveDate > moment(max.date, 'YYYY-MM-DD')) {
                return list;
            }

            return max;
        });
    }
}

module.exports = RestrictedList;
