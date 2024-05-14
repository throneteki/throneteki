const DrawCard = require('../../drawcard');
const GenericTracker = require('../../EventTrackers/GenericTracker');

class CastleGuard extends DrawCard {
    setupCardAbilities() {
        this.tracker = GenericTracker.forPhase(this.game, 'onCardOutOfShadows');

        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card !== this &&
                    card.getType() === 'character' &&
                    this.tracker.some((event) => event.card === card)
            },
            message: '{player} uses {source} to return {target} to shadows',
            handler: (context) => {
                context.player.putIntoShadows(context.target);
            }
        });
    }
}

CastleGuard.code = '13067';

module.exports = CastleGuard;
