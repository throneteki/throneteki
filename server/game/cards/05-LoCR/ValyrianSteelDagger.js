const DrawCard = require('../../drawcard.js');

class ValyrianSteelDagger extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'intrigue'
            ),
            effect: [
                ability.effects.modifyStrength(2),
                ability.effects.addKeyword('stealth')
            ]
        });
    }
}

ValyrianSteelDagger.code = '05021';

module.exports = ValyrianSteelDagger;
