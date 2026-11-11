import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Huntress extends DrawCard {
    // Huntress (13104)
    // While Huntress is standing, each [tyrell] character you control with printed cost 3 or lower
    // gets +1 STR.
    // Action: Kneel Huntress to choose a [tyrell] character with printed cost 3 or lower. It gets
    // +3 STR until the end of the phase.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !context.source.kneeled,
            match: (card, context) =>
                card.isFaction('tyrell') &&
                card.getType() === 'character' &&
                card.getPrintedCost() <= 3 &&
                card.controller === context.source.controller,
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
            message: '{player} kneels {source} to give {target} +3 STR until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.modifyStrength(3)
            }))
        });
    }
}

Huntress.code = '13104';

export default Huntress;
