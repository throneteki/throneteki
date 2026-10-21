import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WhenIWoke extends DrawCard {
    // When I Woke... (12044)
    // Reaction: After a player loses a [military] challenge, that player chooses a participating
    // character and places it on top of its owner's deck. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'military' && !!event.challenge.loser
            },
            target: {
                choosingPlayer: (player, context) => player === context.event.challenge.loser,
                activePromptTitle: 'Select a card',
                cardCondition: { participating: true }
            },
            message: "{player} plays {source} to place {target} on top of its owner's deck",
            max: ability.limit.perChallenge(1),
            gameAction: GameActions.returnCardToDeck((context) => ({
                card: context.target
            }))
        });
    }
}

WhenIWoke.code = '12044';

export default WhenIWoke;
