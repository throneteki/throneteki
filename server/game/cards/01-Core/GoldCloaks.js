import DrawCard from '../../drawcard.js';
import CardEntersPlayTracker from '../../EventTrackers/CardEntersPlayTracker.js';
import GameActions from '../../GameActions/index.js';

class GoldCloaks extends DrawCard {
    // Gold Cloaks (01092)
    // Ambush (2).
    // Forced Interrupt: When a phase ends in which Gold Cloaks entered play using ambush, discard
    // it from play (cannot be saved).
    setupCardAbilities() {
        this.tracker = CardEntersPlayTracker.forPhase(this.game);

        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event, context) => context.source.tracker.hasAmbushed(context.source)
            },
            message: '{player} is forced to discard {source} from play at the end of the phase',
            gameAction: GameActions.discardCard((context) => ({
                card: context.source,
                allowSave: false
            }))
        });
    }
}

GoldCloaks.code = '01092';

export default GoldCloaks;
