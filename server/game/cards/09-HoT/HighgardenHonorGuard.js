const DrawCard = require('../../drawcard.js');

class HighgardenHonorGuard extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('ambush', () => this.getNumberOfReachLocations())
        });
    }

    getNumberOfReachLocations() {
        return this.controller.getNumberOfCardsInPlay(card => card.getType() === 'location' && card.hasTrait('The Reach'));
    }
}

HighgardenHonorGuard.code = '09005';

module.exports = HighgardenHonorGuard;
