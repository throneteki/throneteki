const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class TheHighroad extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Kneel and sacrifice',
            clickToActivate: true,
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            message:
                '{player} kneels and sacrifices {source} to reduce the cost of the next non-character they marshal or play by 2',
            gameAction: GameActions.genericHandler((context) => {
                this.untilEndOfPhase((ability) => ({
                    targetController: 'any',
                    match: (player) => player === context.player,
                    effect: ability.effects.reduceNextMarshalledOrPlayedCardCost(
                        2,
                        (card) => card.getType() !== 'character'
                    )
                }));
            })
        });
    }
}

TheHighroad.code = '23034';

module.exports = TheHighroad;
