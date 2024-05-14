const DrawCard = require('../../drawcard.js');

class Nymeria extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark', unique: true });
        this.whileAttached({
            effect: ability.effects.addKeyword('Intimidate')
        });
        this.action({
            title: 'Attach Nymeria to another character',
            cost: ability.costs.payGold(1),
            target: {
                type: 'select',
                cardCondition: (card) =>
                    this.controller.canAttach(this, card) &&
                    card.location === 'play area' &&
                    card !== this
            },
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                this.controller.attach(this.controller, this, context.target);
                this.game.addMessage(
                    '{0} pays 1 gold to attach {1} to {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

Nymeria.code = '03019';

module.exports = Nymeria;
