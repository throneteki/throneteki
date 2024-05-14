import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { flatten } from '../../../Array.js';

class AWallOfRoses extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event) =>
                    event.challenge.initiatedAgainstPlayer === this.controller
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
                handler: (context) => {
                    this.game.resolveGameAction(
                        GameActions.simultaneously((context) =>
                            flatten(
                                context.targets
                                    .getTargets()
                                    .map((target) => [
                                        GameActions.standCard({ card: target }),
                                        GameActions.removeFromChallenge({ card: target })
                                    ])
                            )
                        ),
                        context
                    );
                }
            })
        });
    }
}

AWallOfRoses.code = '23016';

export default AWallOfRoses;
