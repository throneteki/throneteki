import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShadowPolitics extends DrawCard {
    setupCardAbilities() {
        // TODO: This should probably all be one action with multiple choices,
        // but the `choices` key does not support targeting per choice.

        this.action({
            title: 'Discard from shadows',
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) => card.location === 'shadows' && card !== this
            },
            message: '{player} plays {source} to discard {target} from shadows',
            handler: (context) => {
                this.game.resolveGameAction(GameActions.discardCard({ card: context.target }));
            }
        });

        this.action({
            title: 'Remove from game',
            target: {
                numCards: 5,
                activePromptTitle: 'Select up to 5 cards',
                singleController: true,
                cardCondition: (card) => card.location === 'discard pile'
            },
            message: '{player} plays {source} to remove {target} from the game',
            handler: (context) => {
                let actions = context.target.map((target) => {
                    return GameActions.removeFromGame({ card: target, player: context.player });
                });

                this.game.resolveGameAction(GameActions.simultaneously(actions));
            }
        });

        this.action({
            title: 'Look at hand',
            chooseOpponent: (opponent) => opponent.hand.length > 0,
            message: "{player} plays {source} to look at {opponent}'s hand",
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.lookAtHand({
                        player: context.player,
                        opponent: context.opponent,
                        context
                    })
                );
            }
        });
    }
}

ShadowPolitics.code = '13038';

export default ShadowPolitics;
