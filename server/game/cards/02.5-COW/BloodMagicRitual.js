const DrawCard = require('../../drawcard.js');

class BloodMagicRitual extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: event => event.allowSave && event.card.canBeSaved() && !event.card.hasTrait('Army')
            },
            location: 'hand',
            handler: context => {
                context.event.saveCard();

                if(this.controller.canAttach(this, context.event.card)) {
                    this.controller.attach(this.controller, this, context.event.card, 'play');
                    this.lastingEffect(ability => ({
                        condition: () => !!this.parent,
                        targetLocation: 'any',
                        match: this,
                        effect: [
                            ability.effects.setCardType('attachment'),
                            ability.effects.addKeyword('Terminal'),
                            ability.effects.addTrait('Condition')
                        ]
                    }));
                }

                this.game.addMessage('{0} plays {1} to save {2}', this.controller, this, context.event.card);
            }
        });

        this.whileAttached({
            effect: ability.effects.blankExcludingTraits
        });
    }

    // Explicitly override since it has printed type 'event'.
    canAttach(player, card) {
        return card.getType() === 'character';
    }
}

BloodMagicRitual.code = '02094';

module.exports = BloodMagicRitual;
