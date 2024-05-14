const DrawCard = require('../../drawcard.js');

class SerArysOakheart extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            cost: ability.costs.payGold(2),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('Ally') &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                context.target.controller.discardCard(context.target);
                this.game.addMessage(
                    '{0} uses {1} and pays 2 gold to discard {2} from play',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

SerArysOakheart.code = '04115';

module.exports = SerArysOakheart;
