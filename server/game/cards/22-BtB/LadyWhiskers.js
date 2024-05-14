const DrawCard = require('../../drawcard.js');

class LadyWhiskers extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true, printedCostOrLower: 3 });
        this.whileAttached({
            match: (card) => card.name === 'Tommen Baratheon',
            effect: ability.effects.addKeyword('Stealth')
        });
        this.whileAttached({
            effect: ability.effects.doesNotKneelAsAttacker({ challengeType: 'power' })
        });
    }
}

LadyWhiskers.code = '22009';

module.exports = LadyWhiskers;
