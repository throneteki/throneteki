import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
            condition: (context) =>
                context.source.parent && context.source.parent.isParticipating(),
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 3 &&
                    card.isParticipating()
            },
            message: "{player} sacrifices {source} to return {target} to its owner's hand",
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

LionsTooth.code = '09030';

export default LionsTooth;
