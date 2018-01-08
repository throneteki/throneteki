const DrawCard = require('../../drawcard.js');

class RisenFromTheSea extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: () => true
            },
            location: 'hand',
            target: {
                cardCondition: (card, context) => this.cardCondition(card, context)
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
            effect: ability.effects.modifyStrength(1)
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

    cardCondition(card, context) {
        if(!context.event.cards.includes(card) || !card.canBeSaved()) {
            return false;
        }

        let allowSave = context.event.allowSave || this.canSurviveBurn(card, context);

        return allowSave && card.isFaction('greyjoy') && card.controller === this.controller;
    }

    canSurviveBurn(card, context) {
        return context.event.isBurn && card.controller.canAttach(this, card) && card.getBoostedStrength(1 + card.burnValue) > 0;
    }

    // Explicitly override since it has printed type 'event'.
    canAttach(player, card) {
        return card.getType() === 'character';
    }
}

RisenFromTheSea.code = '01081';

module.exports = RisenFromTheSea;
