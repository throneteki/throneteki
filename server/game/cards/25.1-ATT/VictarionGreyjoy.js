import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class VictarionGreyjoy extends DrawCard {
    // Victarion Greyjoy (25003)
    // Reaction: After a phase begins, kneel a character you control. If it has the:
    // - R’hllor trait, Victarion Greyjoy gains insight and "immune to opponents' character
    // abilities" until the end of the phase.
    // - Drowned God trait, Victarion Greyjoy gains renown and cannot be killed until the end of the
    // phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: () => true
            },
            cost: ability.costs.kneel((card) => card.getType() === 'character'),
            message: {
                format: '{player} uses {source} and kneels {costs.kneel} to have {source} gain {bonuses} until the end of the phase',
                args: {
                    bonuses: (context) => victarionBonuses(context).flatMap(({ text }) => text)
                }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.source,
                effect: victarionBonuses(context).flatMap(({ effects }) =>
                    effects(ability, context)
                )
            }))
        });
    }
}

const Bonuses = [
    {
        trait: "R'hllor",
        text: ['insight', "immunity to opponent's character abilities"],
        effects: (ability, context) => [
            ability.effects.addKeyword('insight'),
            ability.effects.immuneTo(
                (card) => card.controller !== context.player && card.getType() === 'character'
            )
        ]
    },
    {
        trait: 'Drowned God',
        text: ['renown', 'cannot be killed'],
        effects: (ability) => [
            ability.effects.addKeyword('renown'),
            ability.effects.cannotBeKilled()
        ]
    }
];

function victarionBonuses(context) {
    return Bonuses.filter(({ trait }) => context.costs.kneel.hasTrait(trait));
}

VictarionGreyjoy.code = '25003';

export default VictarionGreyjoy;
