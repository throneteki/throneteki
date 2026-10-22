import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class SecretSchemes extends DrawCard {
    // Secret Schemes (17169)
    // Challenges Action: Kneel your faction card to draw X cards (to a maximum of 5 cards). X is
    // the number of plot cards in your used pile.
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw cards',
            phase: 'challenge',
            cost: ability.costs.kneelFactionCard(),
            message: {
                format: '{player} plays {source} and kneels their faction card to draw {amount}',
                args: {
                    amount: (context) =>
                        TextHelper.count(Math.min(context.player.getNumberOfUsedPlots(), 5), 'card')
                }
            },
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: Math.min(context.player.getNumberOfUsedPlots(), 5)
            }))
        });
    }
}

SecretSchemes.code = '17169';

export default SecretSchemes;
