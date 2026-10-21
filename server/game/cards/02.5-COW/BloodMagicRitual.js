import DrawCard from '../../drawcard.js';

class BloodMagicRitual extends DrawCard {
    // Blood Magic Ritual (02094)
    // Interrupt: When a non-Army character would be killed, save it. Then, attach Blood Magic
    // Ritual to that character as a Condition attachment with the text: "Terminal. Treat attached
    // character's printed text box as if it were blank (except for Traits)."
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.allowSave && event.card.canBeSaved() && !event.card.hasTrait('Army')
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
                }

                this.lastingEffect((ability) => ({
                    condition: () => this.location === 'play area',
                    targetLocation: 'any',
                    targetController: 'any',
                    match: (card) => card === this.parent,
                    effect: ability.effects.blankExcludingTraits
                }));

                this.game.addMessage(
                    '{0} plays {1} to save {2}',
                    this.controller,
                    this,
                    context.event.card
                );
            }
        });
    }

    // Explicitly override since it has printed type 'event'.
    canAttach(player, card) {
        return card.getType() === 'character';
    }
}

BloodMagicRitual.code = '02094';

export default BloodMagicRitual;
