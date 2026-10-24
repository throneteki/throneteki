import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AreoHotah extends DrawCard {
    // Areo Hotah (01103)
    // Ambush (5).
    // Reaction: After Areo Hotah enters play during a challenge, choose a participating character,
    // and remove it from the challenge.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source &&
                    context.game.isDuringChallenge() &&
                    context.game.currentPhase === 'challenge'
            },
            target: {
                cardCondition: (card) => card.getType() === 'character' && card.isParticipating()
            },
            message: '{player} uses {source} to remove {target} from the challenge',
            gameAction: GameActions.removeFromChallenge((context) => ({ card: context.target }))
        });
    }
}

AreoHotah.code = '01103';

export default AreoHotah;
