const DrawCard = require('../../../drawcard.js');
const AbilityLimit = require('../../../abilitylimit.js');

class Shae extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.tokens['gold'] = 0;
    }

    setupCardAbilities() {
        this.action({
            title: 'Pay 1 gold to stand Shae',
            method: 'stand',
            phase: 'challenge',
            limit: AbilityLimit.perPhase(2)
        });
    }

    stand(player) {
        if(player.gold <= 0 || !this.kneeled) {
            return false;
        }

        this.controller.gold--;
        player.standCard(this);

        this.game.addMessage('{0} pays 1 gold to stand {1}', this.controller, this);
    }
}

Shae.code = '04029';

module.exports = Shae;
