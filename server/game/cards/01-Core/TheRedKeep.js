import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';
import GameActions from '../../GameActions/index.js';

class TheRedKeep extends DrawCard {
    // The Red Keep (01061)
    // The Red Keep contributes 2 STR to your side during any [power] challenge in which you control
    // a participating character.
    // Interrupt: When the challenges phase ends, if you have not lost a [power] challenge this
    // round, kneel The Red Keep to draw 2 cards.
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forRound(this.game);

        this.persistentEffect({
            condition: (context) =>
                context.game.currentChallenge &&
                context.game.currentChallenge.challengeType === 'power' &&
                context.game.currentChallenge.anyParticipants(
                    (card) => card.controller === context.source.controller
                ) &&
                context.source.controller.canDraw(),
            targetController: 'current',
            effect: ability.effects.contributeStrength(this, 2)
        });
        this.interrupt({
            when: {
                onPhaseEnded: (event, context) =>
                    event.phase === 'challenge' &&
                    !context.source.tracker.some({
                        loser: context.source.controller,
                        challengeType: 'power'
                    })
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to draw 2 cards',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 2 }))
        });
    }
}

TheRedKeep.code = '01061';

export default TheRedKeep;
