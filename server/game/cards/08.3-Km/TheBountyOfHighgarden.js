import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheBountyOfHighgarden extends DrawCard {
    // The Bounty of Highgarden (08044)
    // Limited.
    // Action: Gain 5 gold. (Cannot be canceled.)
    setupCardAbilities() {
        this.action({
            title: 'Gain 5 gold',
            condition: (context) => context.source.controller.canGainGold(),
            cannotBeCanceled: true,
            message: '{player} plays {source} to gain 5 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 5 }))
        });
    }
}

TheBountyOfHighgarden.code = '08044';

export default TheBountyOfHighgarden;
