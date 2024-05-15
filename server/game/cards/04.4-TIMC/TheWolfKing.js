import DrawCard from '../../drawcard.js';

class TheWolfKing extends DrawCard {
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
