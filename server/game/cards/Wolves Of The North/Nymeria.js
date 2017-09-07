const DrawCard = require('../../drawcard.js');

class Nymeria extends DrawCard {

    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('Intimidate')
        });
        //TODO: uses target API but doesn't 'target' per the game rules (doesn't use the word choose)
        this.action({
            title: 'Attach Nymeria to another character',
            cost: ability.costs.payGold(1),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => this.controller.canAttach(this, card) && card.location === 'play area' && card !== this
            },
            limit: ability.limit.perPhase(1),
            handler: context => {
                this.controller.attach(this.controller, this, context.target);
                this.game.addMessage('{0} pays 1 gold to attach {1} to {2}', this.controller, this, context.target);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.isFaction('stark') || !card.isUnique()) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Nymeria.code = '03019';

module.exports = Nymeria;
