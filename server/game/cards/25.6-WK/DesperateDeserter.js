import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class DesperateDeserter extends DrawCard {
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
