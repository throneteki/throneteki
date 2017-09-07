const DrawCard = require('../../../drawcard.js');

class Lady extends DrawCard {

    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        //TODO: uses target API but doesn't 'target' per the game rules (doesn't use the word choose)
        this.action({
            title: 'Attach Lady to another character',
            cost: ability.costs.payGold(1),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => this.controller.canAttach(this, card) && card.location === 'play area' && card !== this.parent
            },
            limit: ability.limit.perPhase(1),
            handler: context => {
                this.controller.attach(this.controller, this, context.target);
                let message = '{0} pays 1 gold to attach {1} to {2}';

                if(context.target.name === 'Sansa Stark' && context.target.kneeled) {
                    context.target.controller.standCard(context.target);
                    message += ' and stand her';
                }
                
                this.game.addMessage(message, this.controller, this, context.target);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.isFaction('stark')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Lady.code = '02004';

module.exports = Lady;
