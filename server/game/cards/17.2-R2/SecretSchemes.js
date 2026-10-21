import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class SecretSchemes extends DrawCard {
    // Secret Schemes (17169)
    // Challenges Action: Kneel your faction card to draw X cards (to a maximum of 5 cards). X is
    // the number of plot cards in your used pile.
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw cards',
            phase: 'challenge',
            condition: () =>
                this.controller.getNumberOfUsedPlots() >= 1 && this.controller.canDraw(),
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                let cards = Math.min(this.controller.getNumberOfUsedPlots(), 5);
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

SecretSchemes.code = '17169';

export default SecretSchemes;
