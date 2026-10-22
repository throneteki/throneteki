import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WickWhittlestick extends DrawCard {
    // Wick Whittlestick (26109)
    // Shadow (3).
    // Reaction: After Wick Whittlestick comes out of shadows during a challenge in which you
    // control a participating character, each player must choose a participating character they
    // control, if able, and discard it from play.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) =>
                    event.card === context.source &&
                    context.player.anyCardsInPlay({ type: 'character', participating: true })
            },
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.choosingPlayer &&
                    card.getType() === 'character' &&
                    card.isParticipating(),
                gameAction: 'discard'
            },
            message: '{player} uses {source} to discard {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.targets.getTargets().map((card) => GameActions.discardCard({ card }))
            )
        });
    }
}

WickWhittlestick.code = '26109';

export default WickWhittlestick;
