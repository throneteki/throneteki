import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GylesRosby extends DrawCard {
    setupCardAbilities() {
        this.stateCheck({
            condition: (context) =>
                this.game.currentPhase === 'challenge' && context.player.gold === 0,
            message: '{player} kills {source} as they have no gold in their gold pool',
            // No save can remedy an empty gold pool, so none can be initiated (FAQ 3.1).
            gameAction: GameActions.kill((context) => ({ card: context.source, allowSave: false }))
        });

        this.plotModifiers({
            gold: 2
        });
    }
}

GylesRosby.code = '26065';

export default GylesRosby;
