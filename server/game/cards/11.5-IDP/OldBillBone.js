import DrawCard from '../../drawcard.js';

class OldBillBone extends DrawCard {
    // Old Bill Bone (11097)
    // Shadow (1).
    // Reaction: After Old Bill Bone comes out of shadows, kneel each opponent's faction card.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            handler: (context) => {
                this.game.addMessage(
                    "{0} uses {1} to kneel each opponent's faction card",
                    context.player,
                    this
                );
                for (let opponent of this.game.getOpponents(context.player)) {
                    opponent.kneelCard(opponent.faction);
                }
            }
        });
    }
}

OldBillBone.code = '11097';

export default OldBillBone;
