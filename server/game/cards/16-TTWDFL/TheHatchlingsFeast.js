import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheHatchlingsFeast extends DrawCard {
    // The Hatchlings' Feast (16014)
    // Action: Choose 3 characters without attachments. Until the end of the phase, one of those
    // characters gets -1 STR, one gets -2 STR, and one gets -3 STR.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give -STR',
            condition: (context) => context.game.filterCardsInPlay(isEligible).length >= 3,
            targets: {
                minus1: {
                    activePromptTitle: 'Select -1 STR',
                    cardCondition: (card) => isEligible(card)
                },
                minus2: {
                    activePromptTitle: 'Select -2 STR',
                    cardCondition: (card, context) =>
                        isEligible(card) && card !== context.targets.minus1
                },
                minus3: {
                    activePromptTitle: 'Select -3 STR',
                    cardCondition: (card, context) =>
                        isEligible(card) &&
                        ![context.targets.minus1, context.targets.minus2].includes(card)
                }
            },
            message: {
                format: '{player} plays {source} to give {minus1} -1 STR, {minus2} -2 STR and {minus3} -3 STR',
                args: {
                    minus1: (context) => context.targets.minus1,
                    minus2: (context) => context.targets.minus2,
                    minus3: (context) => context.targets.minus3
                }
            },
            gameAction: GameActions.simultaneously(
                [1, 2, 3].map((amount) =>
                    GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfPhase',
                        match: context.targets[`minus${amount}`],
                        effect: ability.effects.modifyStrength(-amount)
                    }))
                )
            )
        });
    }
}

function isEligible(card) {
    return (
        card.location === 'play area' &&
        card.getType() === 'character' &&
        card.attachments.length === 0
    );
}

TheHatchlingsFeast.code = '16014';

export default TheHatchlingsFeast;
