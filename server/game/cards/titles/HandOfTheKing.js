import TitleCard from '../../TitleCard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';

class HandOfTheKing extends TitleCard {
    // Hand of the King (01208)
    // Supported by Master of Whispers.
    // Supports: Master of Laws.
    // Rivals: Master of Coin, Master of Ships.
    // You may initiate an additional [power] challenge during the challenges phase, against a
    // different opponent.
    // +1 STR [power]
    setupCardAbilities(ability) {
        const tracker = ChallengeTracker.forPhase(this.game);

        this.supports('Master of Laws');
        this.rivals('Master of Coin', 'Master of Ships');
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.mayInitiateAdditionalChallenge('power', (opponent, context) =>
                allowOpponent(tracker, context.source.controller, opponent)
            )
        });
        this.persistentEffect({
            condition: (context) =>
                context.game.currentChallenge &&
                context.game.currentChallenge.challengeType === 'power' &&
                context.game.currentChallenge.anyParticipants(
                    (card) => card.controller === context.source.controller
                ),
            targetController: 'current',
            effect: ability.effects.contributeStrength(this, 1)
        });
    }
}

function allowOpponent(tracker, player, opponent) {
    const challenges = tracker.filter({ attackingPlayer: player, challengeType: 'power' });
    const opponents = new Set(challenges.map((challenge) => challenge.initiatedAgainstPlayer));
    return opponents.size > 0 && (opponents.size > 1 || !opponents.has(opponent));
}

HandOfTheKing.code = '01208';

export default HandOfTheKing;
