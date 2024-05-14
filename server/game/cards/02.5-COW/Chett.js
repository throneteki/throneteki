const DrawCard = require('../../drawcard.js');

class Chett extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return a card to hand',
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Steward') && card.getType() === 'character'
            ),
            phase: 'dominance',
            limit: ability.limit.perPhase(1),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'discard pile' &&
                    card.controller === this.controller &&
                    (card.hasTrait('Direwolf') || card.hasTrait('Raven'))
            },
            handler: (context) => {
                this.controller.moveCard(context.target, 'hand');
                this.game.addMessage(
                    '{0} uses {1} to kneel {2} to return {3} to their hand',
                    context.player,
                    this,
                    context.costs.kneel,
                    context.target
                );
            }
        });
    }
}

Chett.code = '02085';

module.exports = Chett;
