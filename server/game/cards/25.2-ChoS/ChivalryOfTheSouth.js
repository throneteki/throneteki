import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class ChivalryOfTheSouth extends PlotCard {
    // Chivalry of the South (25036)
    // Interrupt: When a challenge ends in which there are no participating characters, gain 2 power
    // for your faction. (Limit 3 times per round.)
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onChallengeFinished: (event) => event.challenge.getParticipants().length === 0
            },
            message: '{player} uses {source} to gain 2 power for their faction',
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: 2
            })),
            limit: ability.limit.perRound(3)
        });
    }
}

ChivalryOfTheSouth.code = '25036';

export default ChivalryOfTheSouth;
