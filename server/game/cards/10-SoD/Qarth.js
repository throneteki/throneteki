const DrawCard = require('../../drawcard.js');

class Qarth extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard attachment',
            cost: [ability.costs.kneelSelf(), ability.costs.payGold(1)],
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'attachment' &&
                    card.parent &&
                    card.parent.controller === this.controller,
                gameAction: 'discard'
            },
            handler: (context) => {
                context.target.owner.discardCard(context.target);
                this.game.addMessage(
                    '{0} kneels {1} and pays 1 gold to discard {2} from play',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

Qarth.code = '10036';

module.exports = Qarth;
