import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShadowOfTheThrone extends DrawCard {
    // Shadow of the Throne (13048)
    // Shadow (1).
    // Action: Choose and kneel any number of locations with total printed cost 3 or lower. If there
    // is a Kingdom plot card revealed, return Shadow of the Throne to your hand instead of placing
    // it in your discard pile.
    setupCardAbilities() {
        this.action({
            title: 'Kneel locations',
            target: {
                maxStat: () => 3,
                cardStat: (card) => card.getPrintedCost(),
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'location' && !card.kneeled,
                gameAction: 'kneel'
            },
            message: '{player} plays {source} to kneel {target}',
            handler: (context) => {
                let actions = context.target.map((card) => GameActions.kneelCard({ card }));

                this.game.resolveGameAction(GameActions.simultaneously(actions), context);

                if (this.game.anyPlotHasTrait('Kingdom')) {
                    this.game.addMessage(
                        '{0} uses {1} to return {1} to their hand instead of their discard pile',
                        context.player,
                        this
                    );
                    context.player.moveCard(this, 'hand');
                }
            }
        });
    }
}

ShadowOfTheThrone.code = '13048';

export default ShadowOfTheThrone;
