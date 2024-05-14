const DrawCard = require('../../drawcard.js');

class RisenFromTheSea extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) => this.canSaveVsEvent(event)
            },
            location: 'hand',
            handler: (context) => {
                context.event.saveCard();

                if (this.controller.canAttach(this, context.event.card)) {
                    this.controller.attach(this.controller, this, context.event.card, 'play');
                    this.lastingEffect((ability) => ({
                        condition: () => !!this.parent,
                        targetLocation: 'any',
                        match: this,
                        effect: [
                            ability.effects.setCardType('attachment'),
                            ability.effects.addKeyword('Terminal'),
                            ability.effects.addTrait('Condition')
                        ]
                    }));

                    this.lastingEffect((ability) => ({
                        condition: () => this.location === 'play area',
                        targetLocation: 'any',
                        targetController: 'any',
                        match: (card) => card === this.parent,
                        effect: ability.effects.modifyStrength(1)
                    }));
                }

                this.game.addMessage(
                    '{0} plays {1} to save {2}',
                    this.controller,
                    this,
                    context.event.card
                );
            }
        });
    }

    canSaveVsEvent(event) {
        let card = event.card;

        if (!card.canBeSaved()) {
            return false;
        }

        let allowSave = event.allowSave || (event.isBurn && this.canSurviveBurn(card));

        return allowSave && card.isFaction('greyjoy') && card.controller === this.controller;
    }

    canSurviveBurn(card) {
        return card.controller.canAttach(this, card) && card.getBoostedStrength(1) > 0;
    }

    // Explicitly override since it has printed type 'event'.
    canAttach(player, card) {
        return card.getType() === 'character';
    }
}

RisenFromTheSea.code = '01081';

module.exports = RisenFromTheSea;
