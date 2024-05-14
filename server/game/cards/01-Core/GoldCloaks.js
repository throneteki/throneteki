import DrawCard from '../../drawcard.js';
import CardEntersPlayTracker from '../../EventTrackers/CardEntersPlayTracker.js';

class GoldCloaks extends DrawCard {
    setupCardAbilities() {
        this.tracker = CardEntersPlayTracker.forPhase(this.game);

        this.forcedInterrupt({
            when: {
                onPhaseEnded: () => this.tracker.hasAmbushed(this)
            },
            handler: () => {
                this.controller.discardCard(this, false);
                this.game.addMessage(
                    '{0} is forced to discard {1} from play at the end of the phase',
                    this.controller,
                    this
                );
            }
        });
    }
}

GoldCloaks.code = '01092';

export default GoldCloaks;
