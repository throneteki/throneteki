import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';

class TheRedKeep extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forRound(this.game);

        this.persistentEffect({
            condition: () =>
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'power' &&
                this.game.currentChallenge.anyParticipants(
                    (card) => card.controller === this.controller
                ) &&
                this.controller.canDraw(),
            targetController: 'current',
            effect: ability.effects.contributeStrength(this, 2)
        });
        this.interrupt({
            when: {
                onPhaseEnded: (event) =>
                    event.phase === 'challenge' &&
                    !this.tracker.some({ loser: this.controller, challengeType: 'power' })
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let cards = this.controller.drawCardsToHand(2).length;
                this.game.addMessage(
                    '{0} kneels {1} to draw {2}',
                    this.controller,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }
}

TheRedKeep.code = '01061';

export default TheRedKeep;
