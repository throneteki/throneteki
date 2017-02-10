const DrawCard = require('../../../drawcard.js');

class FishingNet extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.allowAsDefender(false)
        });
    }
}

FishingNet.code = '02052';

module.exports = FishingNet;
