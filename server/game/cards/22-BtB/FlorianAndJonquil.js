const DrawCard = require('../../drawcard.js');

class FlorianAndJonquil extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Select a character',
            target: {
                cardCondition: card => card.location === 'play area' && 
                                card.getType() === 'character' && 
                                card.isUnique() && 
                                card.getPrintedCost() <= 3
            },
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('renown')
                }));

                this.game.addMessage('{0} plays {1} to have {2} gain renown until the end of the phase',
                    context.player, this, context.target);
                if(this.controller.canAttach(this, context.target)) {
                    this.controller.attach(this.controller, this, context.target, 'play');
                    this.lastingEffect(ability => ({
                        condition: () => !!this.parent,
                        targetLocation: 'any',
                        match: this,
                        effect: [
                            ability.effects.setCardType('attachment'),
                            ability.effects.addKeyword('Terminal')
                        ]
                    }));
                    
                    this.lastingEffect(ability => ({
                        condition: () => this.location === 'play area',
                        targetLocation: 'any',
                        targetController: 'any',
                        match: card => card === this.parent,
                        effect: [
                            ability.effects.addTrait('Fool'),
                            ability.effects.addTrait('Knight')
                        ]
                    }));
                }
            }
        });
    }

    // Explicitly override since it has printed type 'event'.
    canAttach(player, card) {
        return card.getType() === 'character';
    }
}

FlorianAndJonquil.code = '22028';

module.exports = FlorianAndJonquil;
