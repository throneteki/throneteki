import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SteelshanksWalton extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Take control',
            phase: 'dominance',
            target: {
                cardCondition: {
                    loyal: false,
                    type: 'character',
                    controller: 'opponent',
                    condition: (card, context) =>
                        card.owner === context.player &&
                        GameActions.takeControl({ card, player: context.player }).allow()
                }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.takeControl((context) => ({
                        card: context.target,
                        player: context.player
                    })),
                    context
                );
            }
        });
    }
}

SteelshanksWalton.code = '26051';

export default SteelshanksWalton;
