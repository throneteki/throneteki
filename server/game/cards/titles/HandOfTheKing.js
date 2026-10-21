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
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.supports('Master of Laws');
        this.rivals('Master of Coin', 'Master of Ships');
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.mayInitiateAdditionalChallenge('power', (opponent) =>
                this.allowOpponent(opponent)
            )
        });
        this.persistentEffect({
            condition: () =>
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'power' &&
                this.game.currentChallenge.anyParticipants(
                    (card) => card.controller === this.controller
                ),
            targetController: 'current',
            effect: ability.effects.contributeStrength(this, 1)
        });
    }

    allowOpponent(opponent) {
        let opponents = this.powerChallengeOpponents();

        if (opponents.size === 0) {
            return false;
        }

        if (opponents.size === 1) {
            return !opponents.has(opponent);
        }

        return true;
    }

    powerChallengeOpponents() {
        let powerChallenges = this.tracker.filter({
            attackingPlayer: this.controller,
            challengeType: 'power'
        });

        return new Set(powerChallenges.map((challenge) => challenge.defendingPlayer));
    }
}

HandOfTheKing.code = '01208';

export default HandOfTheKing;
