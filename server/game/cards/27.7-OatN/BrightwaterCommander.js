import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BrightwaterCommander extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isAttacking()
            },
            target: {
                type: 'select',
                cardCondition: {
                    location: 'hand',
                    controller: 'current'
                }
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to reveal {target} from their hand',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.revealCards((context) => ({ cards: [context.target] })).then({
                        condition: (context) => context.revealed.length > 0,
                        message: {
                            format: 'Then, {player} places {revealed} in shadows',
                            args: { revealed: (context) => context.revealed[0] }
                        },
                        gameAction: GameActions.putIntoShadows((context) => ({
                            card: context.revealed[0]
                        }))
                    }),
                    context
                );
            }
        });
    }
}

BrightwaterCommander.code = '27589';
BrightwaterCommander.version = '1.0.0';

export default BrightwaterCommander;
