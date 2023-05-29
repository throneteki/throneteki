const DrawCard = require('../../drawcard.js');
const Message = require('../../Message');
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
            message: {
                format: '{player} plays {source} to {actions}', // TODO: Update this to {gameAction} once handler is replaced by gameAction
                args: { actions: context => Message.fragment(`${(context.target.isMatch({ not: { trait: ['Army', 'Wildling'] } }) ? 'stand and ' : '')}remove {target} from the challenge`, { target: context.target }) }
            },
            handler: context => {
                this.resolveGameAction(
                    GameActions.simultaneously([
                        GameActions.removeFromChallenge(context => ({
                            card: context.target
                        })),
                        GameActions.ifCondition({
                            condition: context => context.target.isMatch({ not: { trait: ['Army', 'Wildling'] } }),
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
