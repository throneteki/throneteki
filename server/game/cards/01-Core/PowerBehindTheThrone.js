import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class PowerBehindTheThrone extends PlotCard {
    setupCardAbilities(ability) {
        this.whenRevealed({
            message: '{player} uses {source} to place 1 stand token on {source}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.placeToken(() => ({ card: this, token: Tokens.stand })),
                    context
                );
            }
        });

        this.action({
            title: 'Discard a stand token',
            cost: ability.costs.discardTokenFromSelf(Tokens.stand),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.kneeled && card.getType() === 'character'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to remove a stand token and stand {2}',
                    context.player,
                    this,
                    context.target
                );

                context.player.standCard(context.target);
            }
        });
    }
}

PowerBehindTheThrone.code = '01018';

export default PowerBehindTheThrone;
