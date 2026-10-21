import PlotCard from '../../plotcard.js';

class TheLongPlan extends PlotCard {
    // The Long Plan (02016)
    // You do not return unspent gold to the treasury during the taxation phase.
    // Reaction: After you lose a challenge, gain 1 gold.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller && this.controller.canGainGold()
            },
            handler: () => {
                this.game.addMessage(
                    '{0} uses {1} to gain 1 gold from losing a challenge',
                    this.controller,
                    this
                );
                this.game.addGold(this.controller, 1);
            }
        });
        this.persistentEffect({
            effect: ability.effects.doesNotReturnUnspentGold()
        });
    }
}

TheLongPlan.code = '02016';

export default TheLongPlan;
