import DrawCard from '../../drawcard.js';

class BrothersRobes extends DrawCard {
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
