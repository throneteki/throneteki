const DrawCard = require('../../drawcard');
const {CardEntersPlayTracker} = require('../../EventTrackers');

class CastleGuard extends DrawCard {
    setupCardAbilities() {
        this.tracker = CardEntersPlayTracker.forPhase(this.game);

        this.reaction({
            when: {
                onCardOutOfShadows: event => event.card === this
            },
            target: {
                cardCondition: (card) => card.location === 'play area' && card !== this && card.getType() === 'character' && this.tracker.hasComeOutOfShadows(card)
            },
            message: '{player} uses {source} to return {target} to shadows',
            handler: context => {
                context.player.putIntoShadows(context.target);
            }
        });
    }
}

CastleGuard.code = '13067';

module.exports = CastleGuard;
