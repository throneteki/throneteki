import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class SecretSchemes extends DrawCard {
    // Secret Schemes (06076)
    // Action: Kneel your faction card to draw X cards. X is the number of plot cards in your used
    // pile.
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw cards',
            cost: ability.costs.kneelFactionCard(),
            message: {
                format: '{player} plays {source} and kneels their faction card to draw {amount}',
                args: {
                    amount: (context) =>
                        TextHelper.count(context.player.getNumberOfUsedPlots(), 'card')
                }
            },
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: context.player.getNumberOfUsedPlots()
            }))
        });
    }
}

SecretSchemes.code = '06076';

export default SecretSchemes;
