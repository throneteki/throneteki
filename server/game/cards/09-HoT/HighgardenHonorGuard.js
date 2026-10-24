import DrawCard from '../../drawcard.js';

class HighgardenHonorGuard extends DrawCard {
    // Highgarden Honor Guard (09005)
    // Ambush (6). No attachments.
    // Reduce the cost to ambush Highgarden Honor Guard by 1 for each The Reach location you
    // control.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('ambush', (card) =>
                card.controller.getNumberOfCardsInPlay(
                    (location) =>
                        location.getType() === 'location' && location.hasTrait('The Reach')
                )
            )
        });
    }
}

HighgardenHonorGuard.code = '09005';

export default HighgardenHonorGuard;
