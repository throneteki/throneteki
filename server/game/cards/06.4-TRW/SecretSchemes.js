import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class SecretSchemes extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw cards',
            condition: () =>
                this.controller.getNumberOfUsedPlots() >= 1 && this.controller.canDraw(),
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                let cards = this.controller.getNumberOfUsedPlots();
                cards = this.controller.drawCardsToHand(cards).length;

                this.game.addMessage(
                    '{0} plays {1} and kneels their faction card to draw {2}',
                    this.controller,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }
}

SecretSchemes.code = '06076';

export default SecretSchemes;
