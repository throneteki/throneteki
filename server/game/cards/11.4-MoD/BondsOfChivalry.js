import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BondsOfChivalry extends DrawCard {
    // Bonds of Chivalry (11064)
    // Action: Choose a participating Knight character you control. Stand it and remove it from the
    // challenge. Then, you may kneel another Knight character you control to have it participate in
    // the challenge on your side.
    setupCardAbilities() {
        this.action({
            title: 'Stand and remove Knight',
            target: {
                cardCondition: {
                    type: 'character',
                    controller: 'current',
                    participating: true,
                    trait: 'Knight'
                }
            },
            message: '{player} plays {source} to stand and remove {target} from the challenge',
            gameAction: GameActions.simultaneously([
                GameActions.standCard((context) => ({ card: context.target })),
                GameActions.removeFromChallenge((context) => ({ card: context.target }))
            ]).then({
                condition: (context) =>
                    context.player.anyCardsInPlay((card) =>
                        canJoin(card, context.parentContext.target)
                    ),
                target: {
                    optional: true,
                    cardCondition: {
                        type: 'character',
                        controller: 'current',
                        trait: 'Knight',
                        condition: (card, context) => canJoin(card, context.parentContext.target)
                    }
                },
                gameAction: GameActions.ifCondition({
                    condition: (context) => !!context.target,
                    thenAction: {
                        message:
                            'Then, {player} kneels {target} to have it participate in the challenge on their side',
                        gameAction: GameActions.simultaneously([
                            GameActions.kneelCard((context) => ({ card: context.target })),
                            GameActions.addToChallenge((context) => ({ card: context.target }))
                        ])
                    }
                })
            })
        });
    }
}

function canJoin(card, removedCard) {
    return (
        card !== removedCard &&
        card.getType() === 'character' &&
        card.hasTrait('Knight') &&
        GameActions.kneelCard({ card }).allow() &&
        GameActions.addToChallenge({ card }).allow()
    );
}

BondsOfChivalry.code = '11064';

export default BondsOfChivalry;
