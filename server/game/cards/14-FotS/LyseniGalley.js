import DrawCard from '../../drawcard.js';

class LyseniGalley extends DrawCard {
    // Lyseni Galley (14019)
    // Action: Kneel Lyseni Galley to choose a character. Until the end of the phase, that character
    // gets +1 STR. If that character is a Captain or Smuggler, it gains stealth until the end of
    // the phase.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give +1 STR',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message: {
                format: '{player} kneels {source} to give {target} +1 STR {additionalEffect}',
                args: {
                    additionalEffect: (context) =>
                        this.isSmugglerOrCaptain(context.target) ? 'and stealth' : ''
                }
            },
            handler: (context) => {
                let effects = [ability.effects.modifyStrength(1)];

                if (this.isSmugglerOrCaptain(context.target)) {
                    effects.push(ability.effects.addKeyword('Stealth'));
                }

                this.untilEndOfPhase(() => ({
                    match: context.target,
                    effect: effects
                }));
            }
        });
    }

    isSmugglerOrCaptain(card) {
        return ['Smuggler', 'Captain'].some((trait) => card.hasTrait(trait));
    }
}

LyseniGalley.code = '14019';

export default LyseniGalley;
