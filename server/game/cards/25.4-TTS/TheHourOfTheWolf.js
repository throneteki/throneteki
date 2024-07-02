import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class TheHourOfTheWolf extends PlotCard {
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
                }
            },
            message: {
                format: '{player} uses {source} to have each player sacrifice {targets}',
                args: { targets: (context) => context.targets.getTargets() }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously((context) =>
                        context.targets
                            .getTargets()
                            .map((card) => GameActions.sacrificeCard({ card }))
                    ),
                    context
                );
            }
        });
    }
}

TheHourOfTheWolf.code = '25072';

export default TheHourOfTheWolf;
