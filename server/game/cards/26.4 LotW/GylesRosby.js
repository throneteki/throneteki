import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GylesRosby extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        // TODO: Update all gold movements to encompass a single event name
        this.registerEvents([
            'onPhaseStarted',
            'onGoldTransferred',
            'onCardEntersPlay',
            'onCardAbilityInitiated'
        ]);
    }
    setupCardAbilities() {
        this.plotModifiers({
            gold: 2
        });
    }

    onPhaseStarted() {
        this.checkKill();
    }

    onGoldTransferred() {
        this.checkKill();
    }

    onCardEntersPlay() {
        this.checkKill();
    }

    onCardAbilityInitiated() {
        this.checkKill();
    }

    checkKill() {
        if (this.game.currentPhase === 'challenge' && this.controller.gold === 0) {
            this.game.resolveGameAction(GameActions.kill({ card: this }));
            this.game.addMessage(
                '{0} is forced to kill {1} due to having no gold in their gold pool',
                this.controller,
                this
            );
        }
    }
}

GylesRosby.code = '26065';

export default GylesRosby;
