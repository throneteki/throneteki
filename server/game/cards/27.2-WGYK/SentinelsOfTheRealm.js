import AgendaCard from '../../agendacard.js';
import { ChallengeTracker } from '../../EventTrackers/ChallengeTracker.js';
import GameActions from '../../GameActions/index.js';
import TextHelper from '../../TextHelper.js';

class SentinelsOfTheRealm extends AgendaCard {
    // Sentinels of the Realm (27040)
    // You may include non-loyal Guard characters from any faction in your deck. You must include at
    // least 12 Guard characters in your deck.
    // While you control no Guard characters, you cannot play events.
    // Interrupt: When the challenges phase ends, draw 1 card for each challenge type that has not
    // been initiated against you this phase.
    setupCardAbilities(ability) {
        const tracker = ChallengeTracker.forPhase(this.game);

        const drawAmount = (context) => {
            const challengeTypes = new Set(
                tracker
                    .filter({ initiatedAgainstPlayer: context.player })
                    .map((challenge) => challenge.challengeType)
            );
            return 3 - challengeTypes.size;
        };

        this.persistentEffect({
            condition: (context) =>
                !context.source.controller.anyCardsInPlay({ type: 'character', trait: 'Guard' }),
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
