const GameActions = require('../../GameActions/index.js');
const PlotCard = require('../../plotcard.js');

class AStarkInWinterfell extends PlotCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: event => event.card.isFaction('stark') && event.card.getType() === 'character' && event.card.controller === this.controller
            },
            limit: ability.limit.perPhase(2),
            message: {
                format: '{player} uses {source} to sacrifice {character} instead of killing them',
                args: { character: context => context.event.card }
            },
            gameAction: GameActions.simultaneously([
                GameActions.genericHandler(context => context.event.cancel()),
                GameActions.sacrificeCard(context => ({ card: context.event.card }))
            ]).then({
                target: {
                    cardCondition: { type: 'character', location: 'discard pile', condition: (card, context) => card !== context.parentContext.event.card }
                },
                message: 'Then, {player} shuffles {target} from their discard pile into their deck',
                handler: context => {
                    context.game.resolveGameAction(
                        GameActions.shuffleIntoDeck(context => ({ cards: [context.target] })),
                        context
                    );
                }
            })
        });
    }
}

AStarkInWinterfell.code = '25572';
AStarkInWinterfell.version = '1.0';

module.exports = AStarkInWinterfell;
