import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerRobarRoyce extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlotsRevealed: (event) =>
                    event.plots.some((plot) => plot.hasTrait('Summer')) &&
                    this.allowGameAction('gainPower')
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to gain a power on {source}',
            gameAction: GameActions.gainPower({ card: this, amount: 1 })
        });

        this.forcedReaction({
            when: {
                onPlotsRevealed: (event) => event.plots.some((plot) => plot.hasTrait('Winter'))
            },
            message: '{player} is firced by {source} to kneel {source}',
            gameAction: GameActions.kneelCard({ card: this })
        });
    }
}

SerRobarRoyce.code = '04103';

export default SerRobarRoyce;
