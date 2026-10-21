import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class ABedOfScorpions extends DrawCard {
    // A Bed of Scorpions (25008)
    // Reaction: After you win an [intrigue] challenge, choose and kill a participating character.
    // (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.source.controller,
                        challengeType: 'intrigue'
                    })
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
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

ABedOfScorpions.code = '25008';

export default ABedOfScorpions;
