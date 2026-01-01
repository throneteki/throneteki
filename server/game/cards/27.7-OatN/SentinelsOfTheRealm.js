import AgendaCard from '../../agendacard.js';
import { ChallengeTracker } from '../../EventTrackers/ChallengeTracker.js';
import GameActions from '../../GameActions/index.js';
import TextHelper from '../../TextHelper.js';

class SentinelsOfTheRealm extends AgendaCard {
    setupCardAbilities(ability) {
        this.challengeTracker = ChallengeTracker.forEndOfPhase(this.game);

        const drawAmount = (context) => {
            const challengeTypes = new Set(
                this.challengeTracker
                    .filter({ initiatedAgainstPlayer: context.player })
                    .map((challenge) => challenge.challengeType)
            );
            return 3 - challengeTypes.size;
        };

        this.persistentEffect({
            match: (card) =>
                card.isMatch({ type: 'character', not: { trait: 'Guard' } }) &&
                this.game.isDuringChallenge({ defendingAlone: card }),
            effect: ability.effects.doesNotContributeStrength()
        });

        this.reaction({
            when: {
                onPhaseEnded: (event, context) =>
                    event.phase === 'challenge' &&
                    context.player.canDraw() &&
                    drawAmount(context) > 0
            },
            message: {
                format: '{player} uses {source} to draw {amount}',
                args: { amount: (context) => TextHelper.count(drawAmount(context), 'card') }
            },
            gameAction: GameActions.drawCards((context) => ({
                amount: drawAmount(context),
                player: context.player
            }))
        });
    }
}

SentinelsOfTheRealm.code = '27619';
SentinelsOfTheRealm.version = '1.0.0';

export default SentinelsOfTheRealm;
