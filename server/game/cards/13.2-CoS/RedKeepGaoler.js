import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RedKeepGaoler extends DrawCard {
    // Red Keep Gaoler (13027)
    // Shadow (4).
    // Action: Move 2 power from your faction card to a [baratheon] character to put Red Keep Gaoler
    // into play from shadows.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put into play',
            condition: (context) => context.player.canPutIntoPlay(context.source, 'outOfShadows'),
            location: 'shadows',
            cost: ability.costs.movePowerFromFaction({
                amount: 2,
                condition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isFaction('baratheon')
            }),
            message: {
                format: '{player} moves 2 power to {powerRecipient} to put {source} into play from shadows',
                args: { powerRecipient: (context) => context.costs.movePowerFromFaction }
            },
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source
            }))
        });
    }
}

RedKeepGaoler.code = '13027';

export default RedKeepGaoler;
