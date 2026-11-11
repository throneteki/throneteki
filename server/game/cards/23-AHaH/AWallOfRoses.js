import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { flatten } from '../../../Array.js';

class AWallOfRoses extends DrawCard {
    // A Wall of Roses (23016)
    // Shadow (1).
    // Reaction: After a challenge is initiated against you, reveal your hand (of at least 1 card).
    // Then, choose up to 2 attacking characters. Stand each of those characters and remove them
    // from the challenge. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.initiatedAgainstPlayer === context.source.controller
            },
            message: '{player} plays {source} to reveal their hand',
            max: ability.limit.perChallenge(1),
            gameAction: GameActions.revealCards((context) => ({
                cards: context.player.hand
            })).then({
                target: {
                    mode: 'upTo',
                    numCards: 2,
                    activePromptTitle: 'Select up to 2 attackers',
                    cardCondition: { type: 'character', attacking: true }
                },
                message: 'Then, {player} stands and removes {target} from the challenge',
                gameAction: GameActions.simultaneously((context) =>
                    flatten(
                        context.target.map((card) => [
                            GameActions.standCard({ card }),
                            GameActions.removeFromChallenge({ card })
                        ])
                    )
                )
            })
        });
    }
}

AWallOfRoses.code = '23016';

export default AWallOfRoses;
