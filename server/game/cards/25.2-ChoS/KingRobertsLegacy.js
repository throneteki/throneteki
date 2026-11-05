import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class KingRobertsLegacy extends DrawCard {
    // King Robert's Legacy (25022)
    // Reaction: After you win a challenge in which you control an attacking King character, choose
    // a kneeling defending character and take control of it. (Max 1 per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.controller.anyCardsInPlay({
                        attacking: true,
                        trait: 'King',
                        type: 'character'
                    })
            },
            target: {
                cardCondition: {
                    participating: true,
                    kneeled: true,
                    type: 'character',
                    controller: 'opponent'
                },
                gameAction: 'takeControl'
            },
            max: ability.limit.perPhase(1),
            message: '{player} uses {source} to take control of {target}',
            gameAction: GameActions.takeControl((context) => ({
                player: context.source.controller,
                card: context.target,
                context
            }))
        });
    }
}

KingRobertsLegacy.code = '25022';

export default KingRobertsLegacy;
