const DrawCard = require('../../drawcard.js');

class AnguyTheArcher extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.controller.anyCardsInPlay(card => card.getType() === 'character' && card.isLoyal()) && this.game.isDuringChallenge({ challengeType: 'military' }),
            match: this,
            effect: [
                ability.effects.doesNotKneelAsAttacker(),
                ability.effects.doesNotKneelAsDefender()
            ]
        });
    }
}

AnguyTheArcher.code = '14041';

module.exports = AnguyTheArcher;
