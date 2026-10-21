import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheHighroad extends DrawCard {
    // The Highroad (23034)
    // Limited.
    // Action: Kneel and sacrifice The Highroad to reduce the cost of the next non-character card
    // you marshal or play this phase by 2.
    // +1 Income.
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
                context.source.untilEndOfPhase((ability) => ({
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

export default TheHighroad;
