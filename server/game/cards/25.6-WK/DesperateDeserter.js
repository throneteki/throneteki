import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class DesperateDeserter extends DrawCard {
    // Desperate Deserter (25109)
    // Shadow (0).
    // Reaction: After a card you control comes out of shadows, choose an opponent. Give control of
    // Desperate Deserter to that player.
    // -1 Income. -1 Initiative.
    setupCardAbilities() {
        this.plotModifiers({
            gold: -1,
            initiative: -1
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card.controller === this.controller
            },
            chooseOpponent: true,
            message: '{player} uses {source} to give control of {source} to {opponent}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.takeControl((context) => ({
                        player: context.opponent,
                        card: this,
                        context
                    })),
                    context
                );
            }
        });
    }
}

DesperateDeserter.code = '25109';

export default DesperateDeserter;
