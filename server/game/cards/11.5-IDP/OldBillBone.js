import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OldBillBone extends DrawCard {
    // Old Bill Bone (11097)
    // Shadow (1).
    // Reaction: After Old Bill Bone comes out of shadows, kneel each opponent's faction card.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            message: "{player} uses {source} to kneel each opponent's faction card",
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .getOpponents(context.player)
                    .map((player) => GameActions.kneelCard({ card: player.faction }))
            )
        });
    }
}

OldBillBone.code = '11097';

export default OldBillBone;
