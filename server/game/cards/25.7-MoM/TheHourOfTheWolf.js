const GameActions = require('../../GameActions/index.js');
const PlotCard = require('../../plotcard.js');

class TheHourOfTheWolf extends PlotCard {
    setupCardAbilities(ability) {
        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) => card.location === 'play area' && card.controller === context.choosingPlayer && card.getType() === 'character'
            },
            message: {
                format: '{player} uses {source} to have each player sacrifice {targets}',
                args: { targets: context => context.targets.getTargets() }
            },
            handler: context => {
                let selections = context.targets.selections.filter(selection => !!selection.value);
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        selections.map(selection => GameActions.sacrificeCard({ player: selection.choosingPlayer, card: selection.value }))
                    )
                );
            }
        });
    }
}

TheHourOfTheWolf.code = '25572';
TheHourOfTheWolf.version = '2.0';

module.exports = TheHourOfTheWolf;
