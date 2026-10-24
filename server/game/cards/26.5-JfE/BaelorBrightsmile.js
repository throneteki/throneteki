import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BaelorBrightsmile extends DrawCard {
    // Baelor Brightsmile (26095)
    // Renown.
    // Reaction: After you win a challenge by 5 or more STR in which Baelor Brightsmile is
    // participating, reveal the top card of your deck. You may place that card on Baelor
    // Brightsmile facedown as a duplicate.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.strengthDifference >= 5 &&
                    context.source.isParticipating()
            },
            message: '{player} uses {source} to reveal the top card of their deck',
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player
            })).then({
                condition: (context) => context.parentContext.revealed.length > 0,
                gameAction: GameActions.may({
                    title: (context) =>
                        `Place ${context.parentContext.revealed[0].name} as duplicate?`,
                    message: {
                        format: '{player} places {revealed} under {source} as a duplicate',
                        args: { revealed: (context) => context.parentContext.revealed[0] }
                    },
                    gameAction: GameActions.placeAsDuplicate((context) => ({
                        card: context.parentContext.revealed[0],
                        parent: context.source,
                        facedown: true
                    }))
                })
            })
        });
    }
}

BaelorBrightsmile.code = '26095';

export default BaelorBrightsmile;
