const DrawCard = require('../../../drawcard.js');

class HealingExpertise extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: event => event.allowSave
            },
            location: 'hand',
            cost: ability.costs.kneel(card => card.hasTrait('Maester') && card.getType() === 'character'),
            target: {
                activePromptTitle: 'Select character to save',
                cardCondition: (card, context) => context.event.cards.includes(card) && !card.hasTrait('Army') && card.controller === this.controller
            },
            handler: context => {
                context.event.saveCard(context.target);                
                this.game.addMessage('{0} plays {1} to kneel {2} to save {3}', 
                                      this.controller, this, context.kneelingCostCard, context.target);
            }
        });
    }
}

HealingExpertise.code = '03044';

module.exports = HealingExpertise;
