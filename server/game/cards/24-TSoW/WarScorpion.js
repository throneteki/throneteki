import DrawCard from '../../drawcard.js';
import Message from '../../Message.js';
import GameActions from '../../GameActions/index.js';

class WarScorpion extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.action({
            title: 'Remove attacker from challenge',
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: { type: 'character', attacking: true }
            },
            message: {
                format: '{player} sacrifices {source} to {options}',
                args: {
                    options: (context) =>
                        Message.fragment(
                            !context.target.isMatch({ trait: ['Army', 'Dragon'] })
                                ? 'remove {target} from the challenge'
                                : 'either kill {target} or remove it from the challenge',
                            { target: context.target }
                        )
                }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.ifCondition({
                        condition: (context) =>
                            !context.target.isMatch({ trait: ['Army', 'Dragon'] }),
                        thenAction: {
                            gameAction: GameActions.removeFromChallenge((context) => ({
                                card: context.target
                            }))
                        },
                        elseAction: GameActions.choose({
                            title: (context) => `Kill ${context.target.name} instead?`,
                            choices: {
                                Kill: {
                                    message: '{player} chooses to kill {target}',
                                    gameAction: GameActions.kill((context) => ({
                                        card: context.target
                                    }))
                                },
                                'Remove from challenge': {
                                    message:
                                        '{player} chooses to remove {target} from the challenge',
                                    gameAction: GameActions.removeFromChallenge((context) => ({
                                        card: context.target
                                    }))
                                }
                            }
                        })
                    }),
                    context
                );
            }
        });
    }
}

WarScorpion.code = '24012';

export default WarScorpion;
