const PlotCard = require('../../plotcard.js');
const GameActions = require('../../GameActions');
const {Tokens} = require('../../Constants');

class PowerBehindTheThrone extends PlotCard {
    setupCardAbilities(ability) {
        this.whenRevealed({
            message: '{player} uses {source} to place 1 stand token on {source}',
            handler: context => {
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
                cardCondition: card => card.location === 'play area' && card.kneeled && card.getType() === 'character'
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to remove a stand token and stand {2}', this.controller, this, context.target);

                this.controller.standCard(context.target);
            }
        });
    }
}

PowerBehindTheThrone.code = '01018';

module.exports = PowerBehindTheThrone;
