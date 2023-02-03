const DrawCard = require('../../drawcard.js');

class LeaderOfTheVanguard extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addTrait('Commander'),
                ability.effects.modifyStrength(1)
            ]
        });
    }
}

LeaderOfTheVanguard.code = '24027';

module.exports = LeaderOfTheVanguard;
