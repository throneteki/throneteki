const DrawCard = require('../../../drawcard.js');

class SecretSchemes extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw cards',
            condition: () => this.controller.getNumberOfUsedPlots() >= 1,
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                let cards = this.controller.getNumberOfUsedPlots();
                this.controller.drawCardsToHand(cards);
                this.game.addMessage('{0} plays {1} and kneels their faction card to draw {2} cards', this.controller, this, cards);
            }
        });
    }
}

SecretSchemes.code = '06076';

module.exports = SecretSchemes;
