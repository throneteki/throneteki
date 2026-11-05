import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TheLongPlan extends PlotCard {
    // The Long Plan (02016)
    // You do not return unspent gold to the treasury during the taxation phase.
    // Reaction: After you lose a challenge, gain 1 gold.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    context.source.controller.canGainGold()
            },
            message: '{player} uses {source} to gain 1 gold from losing a challenge',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
        });
        this.persistentEffect({
            effect: ability.effects.doesNotReturnUnspentGold()
        });
    }
}

TheLongPlan.code = '02016';

export default TheLongPlan;
