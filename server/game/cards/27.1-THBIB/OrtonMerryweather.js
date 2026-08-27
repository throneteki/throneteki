import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/ChallengeTracker.js';
import GameActions from '../../GameActions/index.js';

class OrtonMerryweather extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forRound(this.game);

        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicDominanceStrength(() => this.controller.gold)
        });
        this.interrupt({
            when: {
                onDominanceDetermined: () =>
                    !this.tracker.some({ loser: this.controller, challengeType: 'intrigue' })
            },
            message: '{player} uses {source} to gain 2 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 2 }))
        });
    }
}

OrtonMerryweather.code = '27005';

export default OrtonMerryweather;
