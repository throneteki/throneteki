import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class RenlysPavilion extends DrawCard {
    // Renly's Pavilion (04104)
    // Action: Kneel Renly's Pavilion to choose 2 characters. Until the end of the phase, one of
    // those characters gets -1 STR, and the other gets +1 STR.
    setupCardAbilities(ability) {
        this.action({
            title: 'Modify strength of 2 characters',
            cost: ability.costs.kneelSelf(),
            targets: {
                toLower: {
                    activePromptTitle: 'Select a character to get -1 STR',
                    cardCondition: (card, context) => context.source.cardCondition(card),
                    gameAction: 'decreaseStrength'
                },
                toRaise: {
                    activePromptTitle: 'Select a character to get +1 STR',
                    cardCondition: (card, context) => context.source.cardCondition(card)
                }
            },
            message: {
                format: '{player} kneels {source} to give -1 STR to {toLower} and +1 STR to {toRaise}',
                args: {
                    toLower: (context) => context.targets.toLower,
                    toRaise: (context) => context.targets.toRaise
                }
            },
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    match: context.targets.toLower,
                    effect: ability.effects.modifyStrength(-1)
                })),
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    match: context.targets.toRaise,
                    effect: ability.effects.modifyStrength(1)
                }))
            ])
        });
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.location === 'play area';
    }
}

RenlysPavilion.code = '04104';

export default RenlysPavilion;
