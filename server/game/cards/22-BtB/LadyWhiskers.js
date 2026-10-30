import DrawCard from '../../drawcard.js';

class LadyWhiskers extends DrawCard {
    // Lady Whiskers (22009)
    // Unique character with printed cost 3 or lower only. Ambush (1).
    // If attached character is Tommen Baratheon, he gains stealth.
    // Attached character does not kneel when declared as an attacker in a [power] challenge.
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

export default LadyWhiskers;
