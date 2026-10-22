import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MeeraReed extends DrawCard {
    // Meera Reed (11061)
    // Shadow (1). Stealth.
    // Reaction: After a [stark] character you control is sacrificed, return Meera Reed to shadows.
    // Reaction: After Meera Reed comes out of shadows, choose a character. Until the end of the
    // phase, treat it as if its printed text box were blank (except for Traits).
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onSacrificed: (event, context) =>
                    context.source.isControlledStarkCharacter(event.cardStateWhenSacrificed)
            },
            message: '{player} uses {source} to return {source} to shadows',
            gameAction: GameActions.putIntoShadows((context) => ({
                card: context.source,
                allowSave: false
            }))
        });

        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' && card.location === 'play area'
            },
            message:
                '{player} uses {source} to treat the text box of {target} as blank until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.blankExcludingTraits
            }))
        });
    }

    isControlledStarkCharacter(card) {
        return (
            card.controller === this.controller &&
            card.getType() === 'character' &&
            card.isFaction('stark')
        );
    }
}

MeeraReed.code = '11061';

export default MeeraReed;
