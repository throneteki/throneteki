import AgendaCard from '../../agendacard.js';
import { ChallengeTracker } from '../../EventTrackers/ChallengeTracker.js';
import GameActions from '../../GameActions/index.js';
import TextHelper from '../../TextHelper.js';

class SentinelsOfTheRealm extends AgendaCard {
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);

        const drawAmount = (context) => {
            const challengeTypes = new Set(
                this.tracker
                    .filter({ initiatedAgainstPlayer: context.player })
                    .map((challenge) => challenge.challengeType)
            );
            return 3 - challengeTypes.size;
        };

        this.persistentEffect({
            condition: () => !this.controller.anyCardsInPlay({ type: 'character', trait: 'Guard' }),
            targetController: 'current',
            effect: ability.effects.cannotPlay((card) => card.getType() === 'event')
        });

        this.interrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge'
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

SentinelsOfTheRealm.code = '27040';

export default SentinelsOfTheRealm;
