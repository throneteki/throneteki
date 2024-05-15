import DrawCard from '../../drawcard.js';

class Huntress extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.kneeled,
            match: (card) =>
                card.isFaction('tyrell') &&
                card.getType() === 'character' &&
                card.getPrintedCost() <= 3 &&
                card.controller === this.controller,
            effect: ability.effects.modifyStrength(1)
        });
        this.action({
            title: 'Give character +3 STR',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isFaction('tyrell') &&
                    card.getPrintedCost() <= 3
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to give {2} +3 STR until the end of the phase',
                    this.controller,
                    this,
                    context.target
                );
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(3)
                }));
            }
        });
    }
}

Huntress.code = '13104';

export default Huntress;
