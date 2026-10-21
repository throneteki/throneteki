import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SteelshanksWalton extends DrawCard {
    // Steelshanks Walton (26051)
    // Dominance Action: Choose a non-loyal character you own and take control of it. (Limit once
    // per phase.)
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
