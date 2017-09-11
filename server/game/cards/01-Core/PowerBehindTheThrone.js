const PlotCard = require('../../plotcard.js');

class PowerBehindTheThrone extends PlotCard {
    setupCardAbilities(ability) {
        this.whenRevealed({
            handler: () => {
                this.game.addMessage('{0} adds 1 stand token to {1}', this.controller, this);
                this.addToken('stand', 1);
            }
        });
        this.action({
            title: 'Discard a stand token',
            cost: ability.costs.discardTokenFromSelf('stand'),
            target: {
                cardCondition: card => card.location === 'play area' && card.controller === this.controller && card.kneeled
            },
            handler: context => {
                let player = context.player;
                let card = context.target;

                this.game.addMessage('{0} uses {1} to remove a stand token and stand {2}', player, this, card);

                player.standCard(card);
            }
        });
    }
}

PowerBehindTheThrone.code = '01018';

module.exports = PowerBehindTheThrone;
