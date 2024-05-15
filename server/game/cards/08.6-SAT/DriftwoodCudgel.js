import DrawCard from '../../drawcard.js';

class DriftwoodCudgel extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Drowned God' });

        this.whileAttached({
            effect: ability.effects.dynamicStrength(() => this.controller.deadPile.length)
        });

        this.interrupt({
            when: {
                onCharacterKilled: (event) => event.card === this.parent
            },
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card !== this.parent &&
                    this.controller.canAttach(this, card)
            },
            handler: (context) => {
                this.controller.attach(this.controller, this, context.target);
                context.target.modifyPower(1);

                this.game.addMessage(
                    '{0} uses {1} to attach {1} to {2} and have it gain 1 power',
                    this.controller,
                    this,
                    context.target
                );
            },
            limit: ability.limit.perPhase(1)
        });
    }
}

DriftwoodCudgel.code = '08112';

export default DriftwoodCudgel;
