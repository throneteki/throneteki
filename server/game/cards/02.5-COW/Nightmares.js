import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Nightmares extends DrawCard {
    // Nightmares (02099)
    // Action: Choose a character or location. Until the end of the phase, treat that card's printed
    // text box as if it were blank (except for Traits).
    setupCardAbilities(ability) {
        this.action({
            title: 'Blank a character or location',
            target: {
                activePromptTitle: 'Select a character or location',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    (card.getType() === 'character' || card.getType() === 'location')
            },
            message:
                '{player} plays {source} to treat the text box of {target} as blank until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.blankExcludingTraits
            }))
        });
    }
}

Nightmares.code = '02099';

export default Nightmares;
