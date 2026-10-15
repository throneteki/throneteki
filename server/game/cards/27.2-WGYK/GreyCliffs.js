import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GreyCliffs extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            initiative: 1
        });
        this.interrupt({
            when: {
                onSacrificed: (event) => event.card === this
            },
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

GreyCliffs.code = '27032';

export default GreyCliffs;
