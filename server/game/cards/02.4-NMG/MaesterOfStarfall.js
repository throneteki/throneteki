import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterOfStarfall extends DrawCard {
    // Maester of Starfall (02076)
    // Challenges Action: Kneel Maester of Starfall to choose a character. Until the end of the
    // phase, that character loses (choose one): insight, intimidate, pillage, or renown.
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove a keyword',
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            gameAction: GameActions.choose({
                title: 'Select a keyword',
                choices: {
                    Insight: {
                        message:
                            '{player} kneels {source} to remove the insight keyword from {target}',
                        gameAction: GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.target,
                            effect: ability.effects.removeKeyword('insight')
                        }))
                    },
                    Intimidate: {
                        message:
                            '{player} kneels {source} to remove the intimidate keyword from {target}',
                        gameAction: GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.target,
                            effect: ability.effects.removeKeyword('intimidate')
                        }))
                    },
                    Pillage: {
                        message:
                            '{player} kneels {source} to remove the pillage keyword from {target}',
                        gameAction: GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.target,
                            effect: ability.effects.removeKeyword('pillage')
                        }))
                    },
                    Renown: {
                        message:
                            '{player} kneels {source} to remove the renown keyword from {target}',
                        gameAction: GameActions.lastingEffect((context) => ({
                            duration: 'untilEndOfPhase',
                            match: context.target,
                            effect: ability.effects.removeKeyword('renown')
                        }))
                    }
                }
            })
        });
    }
}

MaesterOfStarfall.code = '02076';

export default MaesterOfStarfall;
