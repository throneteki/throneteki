import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';
import GameActions from '../../GameActions/index.js';

class RiverGate extends DrawCard {
    // River Gate (13016)
    // Limited.
    // Challenges Action: If you have lost 2 or more challenges this phase, sacrifice River Gate to
    // draw 2 cards.
    // +1 Income.
    setupCardAbilities(ability) {
        const tracker = ChallengeTracker.forPhase(this.game);

        this.plotModifiers({
            gold: 1
        });

        this.action({
            title: 'Sacrifice to draw 2 cards',
            condition: (context) => tracker.count({ loser: context.player }) >= 2,
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            message: '{player} sacrifices {source} to draw 2 cards',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 2 }))
        });
    }
}

RiverGate.code = '13016';

export default RiverGate;
