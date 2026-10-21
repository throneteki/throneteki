import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BondsOfChivalry extends DrawCard {
    // Bonds of Chivalry (11064)
    // Action: Choose a participating Knight character you control. Stand it and remove it from the
    // challenge. Then, you may kneel another Knight character you control to have it participate in
    // the challenge on your side.
    setupCardAbilities() {
        const standAndRemoveAction = GameActions.simultaneously([
            GameActions.standCard((context) => ({ card: context.target })),
            GameActions.removeFromChallenge((context) => ({ card: context.target }))
        ]);
        this.action({
            title: 'Stand and remove Knight',
            target: {
                cardCondition: {
                    type: 'character',
                    controller: 'current',
                    participating: true,
                    trait: 'Knight',
                    condition: (card, context) =>
                        standAndRemoveAction.allow({ ...context, target: card })
                }
            },
            message: '{player} plays {source} to stand and remove {target} from the challenge',
            handler: (context) => {
                this.game.resolveGameAction(
                    standAndRemoveAction.then({
                        target: {
                            optional: true,
                            cardCondition: {
                                type: 'character',
                                controller: 'current',
                                trait: 'Knight',
                                condition: (card, context) =>
                                    card !== context.parentContext.target &&
                                    GameActions.kneelCard({ card }).allow() &&
                                    GameActions.addToChallenge({ card }).allow()
                            }
                        },
                        handler: (context) => {
                            this.game.resolveGameAction(
                                GameActions.ifCondition({
                                    condition: (context) => context.target,
                                    thenAction: {
                                        gameAction: GameActions.simultaneously([
                                            GameActions.kneelCard((context) => ({
                                                card: context.target
                                            })),
                                            GameActions.addToChallenge((context) => ({
                                                card: context.target
                                            }))
                                        ]),
                                        message:
                                            'Then, {player} kneels {target} to have it participate in the challenge on their side'
                                    }
                                }),
                                context
                            );
                        }
                    }),
                    context
                );
            }
        });
    }
}

BondsOfChivalry.code = '11064';

export default BondsOfChivalry;
