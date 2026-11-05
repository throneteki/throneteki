import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class LionsOfTheRock extends PlotCard {
    // Lions of the Rock (05046)
    // Reaction: After the challenges phase begins, gain 3 gold.
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event, context) =>
                    event.phase === 'challenge' && context.source.controller.canGainGold()
            },
            message: '{player} uses {source} to gain 3 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 3 }))
        });
    }
}

LionsOfTheRock.code = '05046';

export default LionsOfTheRock;
