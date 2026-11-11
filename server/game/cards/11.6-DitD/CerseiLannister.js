import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CerseiLannister extends DrawCard {
    // Cersei Lannister (11109)
    // Shadow (5).
    // Reaction: After a card you control comes out of shadows during the challenges phase, each
    // opponent discards 1 card at random from his or her hand. (Limit 3 times per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) =>
                    event.card.controller === context.source.controller &&
                    context.game.currentPhase === 'challenge'
            },
            limit: ability.limit.perPhase(3),
            message: "{player} uses {source} to discard 1 card at random from each opponent's hand",
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .getOpponents(context.player)
                    .map((player) => GameActions.discardAtRandom({ player, amount: 1 }))
            )
        });
    }
}

CerseiLannister.code = '11109';

export default CerseiLannister;
