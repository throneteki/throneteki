import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class StarfallCavalry extends DrawCard {
    // Starfall Cavalry (04035)
    // No attachments except Weapon.
    // Reaction: After Starfall Cavalry enters play, draw 1 card. (3 cards instead if there are 3 or
    // more plot cards in your used pile.)
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            message: {
                format: '{player} uses {source} to draw {amount}',
                args: {
                    amount: (context) =>
                        TextHelper.count(context.player.getNumberOfUsedPlots() >= 3 ? 3 : 1, 'card')
                }
            },
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: context.player.getNumberOfUsedPlots() >= 3 ? 3 : 1
            }))
        });
    }
}

StarfallCavalry.code = '04035';

export default StarfallCavalry;
