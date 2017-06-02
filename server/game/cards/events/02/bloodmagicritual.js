const DrawCard = require('../../../drawcard.js');

class BloodMagicRitual extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: event => event.allowSave
            },
            location: 'hand',
            target: {
                activePromptTitle: 'Select character to save',
                cardCondition: (card, context) => context.event.cards.includes(card) && !card.hasTrait('Army')
            },
            handler: context => {
                context.event.saveCard(context.target);
                context.target.controller.attach(this.controller, this, context.target.uuid, 'play');
                
                this.game.addMessage('{0} plays {1} to save {2}', this.controller, this, context.target);
            }
        });
        
        this.whileAttached({
            effect: ability.effects.blank
        });

        this.persistentEffect({
            condition: () => !!this.parent,
            match: this,
            effect: [
                ability.effects.addKeyword('Terminal'),
                ability.effects.addTrait('Condition')
            ]
        });
    }
}

BloodMagicRitual.code = '02094';

module.exports = BloodMagicRitual;
