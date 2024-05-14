import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class ABedOfScorpions extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({ winner: this.controller, challengeType: 'intrigue' })
            },
            target: {
                cardCondition: {
                    type: 'character',
                    participating: true,
                    condition: (card) => GameActions.kill({ card }).allow()
                }
            },
            max: ability.limit.perChallenge(1),
            message: '{player} plays {source} to kill {target}',
            handler: (context) => {
                context.game.resolveGameAction(
                    GameActions.kill((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

ABedOfScorpions.code = '25008';

export default ABedOfScorpions;
