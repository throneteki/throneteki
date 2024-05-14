import DrawCard from '../../drawcard.js';

class RedKeepGaoler extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put into play',
            condition: (context) => context.player.canPutIntoPlay(this, 'outOfShadows'),
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
            handler: (context) => {
                context.player.putIntoPlay(this);
            }
        });
    }
}

RedKeepGaoler.code = '13027';

export default RedKeepGaoler;
