import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SeizeTheInitiative extends DrawCard {
    // Seize the Initiative (11013)
    // X is the number of opponents you have.
    // Interrupt: When the marshaling phase ends, you become the first player.
    setupCardAbilities() {
        this.xValue({
            value: (context) => context.game.getOpponents(context.player).length
        });

        this.interrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'marshal'
            },
            message: '{player} plays {source} to become first player',
            gameAction: GameActions.setFirstPlayer((context) => ({ player: context.player }))
        });
    }
}

SeizeTheInitiative.code = '11013';

export default SeizeTheInitiative;
