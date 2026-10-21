import DrawCard from '../../drawcard.js';

class BrothersRobes extends DrawCard {
    // Brother's Robes (10043)
    // The Seven character only.
    // Reaction: After attached character is knelt, choose a location or attachment. Until the end
    // of the phase, treat that card as if its printed text box were blank (except for Traits).
    setupCardAbilities() {
        this.attachmentRestriction({ trait: 'The Seven' });
        this.reaction({
            when: {
                onCardKneeled: (event) => event.card === this.parent
            },
            target: {
                activePrompTitle: 'Select a location or attachment',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    ['location', 'attachment'].includes(card.getType())
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.blankExcludingTraits
                }));

                this.game.addMessage(
                    '{0} uses {1} to treat the text box of {2} as blank until the end of the phase',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

BrothersRobes.code = '10043';

export default BrothersRobes;
