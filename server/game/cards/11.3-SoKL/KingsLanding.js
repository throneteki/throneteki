import DrawCard from '../../drawcard.js';
import GenericTracker from '../../EventTrackers/GenericTracker.js';
import GameActions from '../../GameActions/index.js';

class KingsLanding extends DrawCard {
    // King's Landing (11058)
    // Once per marshaling phase, you may marshal a location from your discard pile as if it were in
    // your hand.
    // Challenges Action: Kneel King's Landing and discard 1 location from your hand to draw 1 card.
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
            message:
                '{player} kneels {source} and discards {costs.discardFromHand} from their hand to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
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

export default KingsLanding;
