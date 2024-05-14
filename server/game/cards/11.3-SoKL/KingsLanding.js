const DrawCard = require('../../drawcard.js');
const GenericTracker = require('../../EventTrackers/GenericTracker');

class KingsLanding extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = GenericTracker.forPhase(this.game, 'onCardMarshalled');

        this.persistentEffect({
            condition: () => !this.hasMarshalledThisPhase(),
            targetController: 'current',
            effect: ability.effects.canMarshal(
                (card) =>
                    card.controller === this.controller &&
                    card.location === 'discard pile' &&
                    card.getType() === 'location'
            )
        });

        this.action({
            title: 'Draw 1 card',
            phase: 'challenge',
            condition: () => this.controller.canDraw(),
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.discardFromHand((card) => card.getType() === 'location')
            ],
            handler: (context) => {
                context.player.drawCardsToHand(1);
                this.game.addMessage(
                    '{0} kneels {1} and discards {2} from their hand to draw 1 card',
                    context.player,
                    this,
                    context.costs.discardFromHand
                );
            }
        });
    }

    hasMarshalledThisPhase() {
        return this.tracker.events.some(
            (event) =>
                event.player === this.controller &&
                event.originalController === this.controller &&
                event.originalLocation === 'discard pile' &&
                event.card.getType() === 'location'
        );
    }
}

KingsLanding.code = '11058';

module.exports = KingsLanding;
