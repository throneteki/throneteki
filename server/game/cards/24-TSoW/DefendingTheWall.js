const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class DefendingTheWall extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Remove character from challenge',
            phase: 'challenge',
            condition: context => context.player.anyCardsInPlay({ name: ['Castle Black', 'The Wall'] }),
            target: {
                cardCondition: card => card.isAttacking() && card.getType() === 'character' && card.getNumberOfIcons() > 1 
            },
            message: '{player} plays {source} to remove {target} from the challenge',
            handler: context => {
                this.resolveGameAction(
                    GameActions.simultaneously([
                        GameActions.removeFromChallenge(context => ({
                            card: context.target
                        })),
                        GameActions.ifCondition({
                            condition: context => !(context.target.hasTrait('Army') || context.target.hasTrait('Wildling')),
                            thenAction: GameActions.standCard(context => ({
                                card: context.target
                            }))
                        })
                    ]),
                    context
                );
            }
        });
    }
}

DefendingTheWall.code = '24015';

module.exports = DefendingTheWall;
