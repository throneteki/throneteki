import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Needle extends DrawCard {
    // Needle (03020)
    // [stark] character only.
    // Attached character gets +2 STR.
    // Interrupt: When attached character is sacrificed, sacrifice Needle to return that character
    // to your hand instead of placing it in your discard pile.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark' });
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });

        this.interrupt({
            when: {
                onSacrificed: (event, context) => event.card === context.source.parent
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {source} to return {card} to their hand',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.replaceEvent((context) => ({
                event: context.event,
                replacement: GameActions.placeCard({ card: context.event.card, location: 'hand' })
            }))
        });
    }
}

Needle.code = '03020';

export default Needle;
