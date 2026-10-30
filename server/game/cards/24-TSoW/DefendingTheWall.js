import DrawCard from '../../drawcard.js';
import Message from '../../Message.js';
import GameActions from '../../GameActions/index.js';

class DefendingTheWall extends DrawCard {
    // Defending the Wall (24015)
    // Play only if you control Castle Black or The Wall.
    // Challenges Action: Choose an attacking character with more than 1 challenge icon, and remove
    // it from the challenge. If that character does not have the Army or Wildling trait, stand it.
    setupCardAbilities() {
        this.action({
            title: 'Remove character from challenge',
            phase: 'challenge',
            condition: (context) =>
                context.player.anyCardsInPlay({ name: ['Castle Black', 'The Wall'] }),
            target: {
                cardCondition: {
                    type: 'character',
                    attacking: true,
                    condition: (card) => card.getNumberOfIcons() > 1
                }
            },
            message: {
                format: '{player} plays {source} to {actions}',
                args: {
                    actions: (context) =>
                        Message.fragment(
                            `${context.target.isMatch({ not: { trait: ['Army', 'Wildling'] } }) ? 'stand and ' : ''}remove {target} from the challenge`,
                            { target: context.target }
                        )
                }
            },
            gameAction: GameActions.simultaneously([
                GameActions.removeFromChallenge((context) => ({
                    card: context.target
                })),
                GameActions.ifCondition({
                    condition: (context) =>
                        context.target.isMatch({ not: { trait: ['Army', 'Wildling'] } }),
                    thenAction: GameActions.standCard((context) => ({
                        card: context.target
                    }))
                })
            ])
        });
    }
}

DefendingTheWall.code = '24015';

export default DefendingTheWall;
