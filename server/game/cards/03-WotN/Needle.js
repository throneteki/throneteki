import DrawCard from '../../drawcard.js';

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
                onSacrificed: (event) => event.card === this.parent
            },
            cost: ability.costs.sacrificeSelf(),
            handler: (context) => {
                this.game.addMessage(
                    '{0} sacrifices {1} to return {2} to their hand',
                    context.player,
                    this,
                    context.event.card
                );
                context.replaceHandler(() => {
                    context.event.cardStateWhenSacrificed = context.event.card.createSnapshot();
                    this.controller.returnCardToHand(context.event.card, false);
                });
            }
        });
    }
}

Needle.code = '03020';

export default Needle;
