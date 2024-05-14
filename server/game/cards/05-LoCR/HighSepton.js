import DrawCard from '../../drawcard.js';

class HighSepton extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            limit: ability.limit.perPhase(1),
            when: {
                onTargetsChosen: (event) =>
                    event.ability.isTriggeredAbility() &&
                    event.targets.hasSingleTarget() &&
                    event.targets.anySelection(
                        (selection) =>
                            selection.choosingPlayer !== this.controller &&
                            selection.value.getType() === 'character' &&
                            selection.value.controller === this.controller
                    )
            },
            target: {
                cardCondition: (card, context) => this.isEligibleCharacter(card, context)
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to choose {2} as the target for {3} instead',
                    this.controller,
                    this,
                    context.target,
                    context.event.ability.card
                );
                context.event.targets.selections[0].resolve(context.target);
            }
        });
    }

    isEligibleCharacter(card, context) {
        let selection = context.event.targets.selections[0];
        return (
            selection.isEligible(card) &&
            card.controller === this.controller &&
            card.getType() === 'character' &&
            card.hasTrait('The Seven')
        );
    }
}

HighSepton.code = '05039';

export default HighSepton;
