import DrawCard from '../../drawcard.js';
import ParticipationTracker from '../../EventTrackers/ParticipationTracker.js';

class FlamingSword extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = ParticipationTracker.forPhase(this.game);

        this.whileAttached({
            effect: ability.effects.addIcon('power')
        });
        this.whileAttached({
            effect: ability.effects.addKeyword('Intimidate')
        });

        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event) =>
                    event.phase === 'challenge' && this.tracker.hasAttacked(this.parent)
            },
            handler: () => {
                this.game.addMessage('{0} is forced to sacrifice {1}', this.controller, this);
                this.controller.sacrificeCard(this);
            }
        });
    }
}

FlamingSword.code = '00124';

export default FlamingSword;
