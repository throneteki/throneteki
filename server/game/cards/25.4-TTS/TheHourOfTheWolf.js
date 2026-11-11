import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class TheHourOfTheWolf extends PlotCard {
    // The Hour of the Wolf (25072)
    // When Revealed: Each player sacrifices a non-loyal character, if able.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    loyal: false,
                    controller: 'choosingPlayer'
                },
                gameAction: GameActions.sacrificeCard((context) => ({ card: context.target }))
            },
            message: {
                format: '{player} uses {source} to have each player sacrifice {targets}',
                args: { targets: (context) => context.targets.getTargets() }
            }
        });
    }
}

TheHourOfTheWolf.code = '25072';

export default TheHourOfTheWolf;
