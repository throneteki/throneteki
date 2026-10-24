import DrawCard from '../../drawcard.js';

class TheWolfKing extends DrawCard {
    // The Wolf King (04062)
    // [stark] character only.
    // Attached character gains the King trait and does not kneel when declared as an attacker in a
    // [military] challenge.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark' });
        this.whileAttached({
            effect: ability.effects.addTrait('King')
        });
        this.whileAttached({
            effect: ability.effects.doesNotKneelAsAttacker({ challengeType: 'military' })
        });
    }
}

TheWolfKing.code = '04062';

export default TheWolfKing;
