const PlotCard = require('../../plotcard.js');

class PowerBehindTheThrone extends PlotCard {
    setupCardAbilities(ability) {
        this.whenRevealed({
            handler: () => {
                this.game.addMessage('{0} adds 1 stand token to {1}', this.controller, this);
                this.modifyToken('stand', 1);
            }
        });
        this.action({
            title: 'Discard a stand token',
            cost: ability.costs.discardTokenFromSelf('stand'),
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
