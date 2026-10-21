import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/ChallengeTracker.js';
import GameActions from '../../GameActions/index.js';

class OrtonMerryweather extends DrawCard {
    // Orton Merryweather (27005)
    // Each gold in your gold pool contributes an additional 1 STR towards your total for dominance.
    // Interrupt: When dominance is determined, if you have not lost an [intrigue] challenge this
    // round, gain 2 gold.
    setupCardAbilities(ability) {
        const tracker = ChallengeTracker.forRound(this.game);

        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicDominanceStrength((card) => card.controller.gold)
        });
        this.interrupt({
            when: {
                onDominanceDetermined: (event, context) =>
                    !tracker.some({ loser: context.player, challengeType: 'intrigue' })
            },
            message: '{player} uses {source} to gain 2 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 2 }))
        });
    }
}

OrtonMerryweather.code = '27005';

export default OrtonMerryweather;
