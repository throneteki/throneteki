import DrawCard from '../../drawcard.js';

class CityGates extends DrawCard {
    // City Gates (11038)
    // Limited.
    // Action: Pay 1 gold and discard City Gates from your hand to draw 1 card.
    // +1 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Draw 1 card',
            condition: () => this.controller.canDraw(),
            cost: [ability.costs.payGold(1), ability.costs.discardSelfFromHand()],
            location: 'hand',
            handler: (context) => {
                context.player.drawCardsToHand(1);
                this.game.addMessage(
                    '{0} pays 1 gold and discards {1} from their hand to draw 1 card',
                    context.player,
                    this
                );
            }
        });
    }
}

CityGates.code = '11038';

export default CityGates;
