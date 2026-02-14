import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class WeLightTheWay extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put card into shadows',
            cost: ability.costs.kneel(
                (card) => card.hasTrait('House Hightower') || card.hasTrait('Oldtown')
            ),
            handler: (context) => {
                this.topCard = context.player.drawDeck[0];
                this.game.addMessage(
                    '{0} uses {1} and kneels {2} to put the top card of their deck into shadow',
                    context.player,
                    this,
                    context.costs.kneel
                );
                context.player.putIntoShadows(this.topCard, false, () => {
                    this.topCard.modifyToken(Tokens.shadow, 1);
                    this.lastingEffect((ability) => ({
                        condition: () => this.topCard.location === 'shadows',
                        targetLocation: 'any',
                        match: this.topCard,
                        effect: ability.effects.addKeyword(
                            `Shadow (${this.topCard.translateXValue(this.topCard.getPrintedCost())})`
                        )
                    }));
                });
            }
        });
    }
}

WeLightTheWay.code = '20040';

export default WeLightTheWay;
