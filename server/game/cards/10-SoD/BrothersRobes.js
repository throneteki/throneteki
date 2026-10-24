import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class BrothersRobes extends DrawCard {
    // Brother's Robes (10043)
    // The Seven character only.
    // Reaction: After attached character is knelt, choose a location or attachment. Until the end
    // of the phase, treat that card as if its printed text box were blank (except for Traits).
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'The Seven' });
        this.reaction({
            when: {
                onCardKneeled: (event, context) => event.card === context.source.parent
            },
            target: {
                activePrompTitle: 'Select a location or attachment',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    ['location', 'attachment'].includes(card.getType())
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
}

BrothersRobes.code = '10043';

export default BrothersRobes;
