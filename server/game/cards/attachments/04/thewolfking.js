const DrawCard = require('../../../drawcard.js');

class TheWolfKing extends DrawCard {
    setupCardAbilities(ability) {
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

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.isFaction('stark')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

TheWolfKing.code = '04062';

module.exports = TheWolfKing;
