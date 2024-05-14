import DrawCard from '../../drawcard.js';

class HighgardenHonorGuard extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('ambush', () => this.getNumberOfReachLocations())
        });
    }

    getNumberOfReachLocations() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.getType() === 'location' && card.hasTrait('The Reach')
        );
    }
}

HighgardenHonorGuard.code = '09005';

export default HighgardenHonorGuard;
