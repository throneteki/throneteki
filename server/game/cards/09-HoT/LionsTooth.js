import DrawCard from '../../drawcard.js';

class LionsTooth extends DrawCard {
    // Lion's Tooth (09030)
    // Unique [lannister] character only. Ambush (2).
    // Attached character gets +1 STR.
    // Action: During a challenge in which attached character is participating, sacrifice Lion’s
    // Tooth to choose a participating character with printed cost 3 or lower and return it to its
    // owner’s hand.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'lannister', unique: true });
        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });
        this.action({
            title: "Return character to owner's hand",
            condition: () => this.parent && this.parent.isParticipating(),
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 3 &&
                    card.isParticipating()
            },
            handler: (context) => {
                this.game.addMessage(
                    "{0} sacrifices {1} to return {2} to its owner's hand",
                    context.player,
                    this,
                    context.target
                );
                context.target.owner.returnCardToHand(context.target);
            }
        });
    }
}

LionsTooth.code = '09030';

export default LionsTooth;
