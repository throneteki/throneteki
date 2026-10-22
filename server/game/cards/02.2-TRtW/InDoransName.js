import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class InDoransName extends DrawCard {
    // In Doran's Name (02036)
    // Action: Kneel your faction card to gain X gold. X is the number of plot cards in your used
    // pile.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel faction card to gain gold',
            cost: ability.costs.kneelFactionCard(),
            message: {
                format: '{player} plays {source} and kneels their faction card to gain {amount} gold',
                args: { amount: (context) => context.player.getNumberOfUsedPlots() }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: context.player.getNumberOfUsedPlots()
            }))
        });
    }
}

InDoransName.code = '02036';

export default InDoransName;
