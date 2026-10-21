import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerRobarRoyce extends DrawCard {
    // Ser Robar Royce (04103)
    // Reaction: After a Summer plot card is revealed, Ser Robar Royce gains 1 power. (Limit once
    // per phase).
    // Forced Reaction: After a Winter plot card is revealed, kneel Ser Robar Royce.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlotsRevealed: (event, context) =>
                    event.plots.some((plot) => plot.hasTrait('Summer')) &&
                    context.source.allowGameAction('gainPower')
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
