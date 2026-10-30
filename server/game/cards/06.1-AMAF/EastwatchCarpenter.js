import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class EastwatchCarpenter extends DrawCard {
    // Eastwatch Carpenter (06005)
    // No attachments except Weapon.
    // Reaction: After you collect income, gain 1 gold for every 2 [thenightswatch] locations you
    // control.
    setupCardAbilities() {
        this.reaction({
            when: {
                onIncomeCollected: (event, context) => event.player === context.player
            },
            message: {
                format: '{player} uses {source} to gain {amount} gold',
                args: { amount: (context) => carpenterGold(context.player) }
            },
            gameAction: GameActions.gainGold((context) => ({
                player: context.player,
                amount: carpenterGold(context.player)
            }))
        });
    }
}

function carpenterGold(player) {
    const locations = player.getNumberOfCardsInPlay(
        (card) => card.isFaction('thenightswatch') && card.getType() === 'location'
    );
    return Math.floor(locations / 2);
}

EastwatchCarpenter.code = '06005';

export default EastwatchCarpenter;
