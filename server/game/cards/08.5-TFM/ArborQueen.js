import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class ArborQueen extends DrawCard {
    // Arbor Queen (08084)
    // Action: Kneel Arbor Queen to choose a [tyrell] character and a non-[tyrell] character. Until
    // the end of the phase, each of those characters gets +2 STR.
    setupCardAbilities(ability) {
        this.action({
            title: 'Increase strength of 2 characters',
            cost: ability.costs.kneelSelf(),
            targets: {
                first: {
                    activePromptTitle: 'Select a Tyrell character',
                    cardCondition: (card) =>
                        card.getType() === 'character' &&
                        card.location === 'play area' &&
                        card.isFaction('tyrell')
                },
                second: {
                    activePromptTitle: 'Select a non-Tyrell character',
                    cardCondition: (card) =>
                        card.getType() === 'character' &&
                        card.location === 'play area' &&
                        !card.isFaction('tyrell')
                }
            },
            message: {
                format: '{player} kneels {source} to give +2 STR to {first} and {second}',
                args: {
                    first: (context) => context.targets.first,
                    second: (context) => context.targets.second
                }
            },
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    match: context.targets.first,
                    effect: ability.effects.modifyStrength(2)
                })),
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    match: context.targets.second,
                    effect: ability.effects.modifyStrength(2)
                }))
            ])
        });
    }
}

ArborQueen.code = '08084';

export default ArborQueen;
