const DrawCard = require('../../drawcard.js');

class BloodMagicRitual extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: event => event.allowSave
            },
            location: 'hand',
            target: {
                cardCondition: (card, context) => context.event.cards.includes(card) && card.canBeSaved() && !card.hasTrait('Army')
            },
            handler: context => {
                context.event.saveCard(context.target);

                if(this.controller.canAttach(this, context.target)) {
                    this.controller.attach(this.controller, this, context.target, 'play');
                    this.setCardType('attachment');
                }

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

    // Explicitly override since it has printed type 'event'.
    canAttach(player, card) {
        return card.getType() === 'character';
    }
}

BloodMagicRitual.code = '02094';

module.exports = BloodMagicRitual;
