const DrawCard = require('../../drawcard.js');

class TheWolfKing extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark' });
        this.whileAttached({
            effect: ability.effects.addTrait('King')
        });
        this.whileAttached({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'military'
            ),
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }
}

TheWolfKing.code = '04062';

module.exports = TheWolfKing;
