import DrawCard from '../../drawcard.js';

class Tithe extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel character to gain 2 gold',
            condition: () => this.controller.canGainGold(),
            cost: ability.costs.kneel(
                (card) => card.isFaction('neutral') && card.getType() === 'character'
            ),
            handler: (context) => {
                let gold = this.game.addGold(this.controller, 2);
                this.game.addMessage(
                    '{0} uses {1} to kneel {2} to gain {3} gold',
                    this.controller,
                    this,
                    context.costs.kneel,
                    gold
                );
            }
        });
    }
}

Tithe.code = '03045';

export default Tithe;
