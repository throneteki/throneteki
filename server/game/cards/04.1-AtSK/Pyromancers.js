const DrawCard = require('../../drawcard.js');

class Pyromancers extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a location',
            phase: 'dominance',
            cost: [ability.costs.kneelSelf(), ability.costs.discardFactionPower(1)],
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    !card.isLimited() &&
                    card.getType() === 'location',
                gameAction: 'discard'
            },
            handler: (context) => {
                context.target.controller.discardCard(context.target);
                this.game.addMessage(
                    '{0} kneels {1} and discards a power from their faction to discard {2} from play',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

Pyromancers.code = '04018';

module.exports = Pyromancers;
