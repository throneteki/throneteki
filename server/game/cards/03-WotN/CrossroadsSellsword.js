import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CrossroadsSellsword extends DrawCard {
    // Crossroads Sellsword (03029)
    // Interrupt: When Crossroads Sellsword is killed during the challenges phase, gain 2 gold.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, context) =>
                    event.card === context.source &&
                    context.source.controller === event.card.controller &&
                    context.game.currentPhase === 'challenge' &&
                    context.source.controller.canGainGold()
            },
            message: '{player} uses {source} to gain 2 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 2 }))
        });
    }
}

CrossroadsSellsword.code = '03029';

export default CrossroadsSellsword;
