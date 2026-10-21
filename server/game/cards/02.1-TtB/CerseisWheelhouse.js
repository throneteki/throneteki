import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CerseisWheelhouse extends DrawCard {
    // Cersei's Wheelhouse (02010)
    // Reaction: After you become the first player, either: gain 1 gold, or draw 1 card.
    // -1 Initiative.
    setupCardAbilities() {
        this.reaction({
            when: {
                onFirstPlayerDetermined: (event) =>
                    this.controller === event.player &&
                    (this.controller.canGainGold() || this.controller.canDraw())
            },
            choices: {
                'Gain 1 gold': {
                    message: '{player} uses {source} to gain 1 gold',
                    gameAction: GameActions.gainGold((context) => ({
                        player: context.player,
                        amount: 1
                    }))
                },
                'Draw 1 card': {
                    message: '{player} uses {source} to draw 1 card',
                    gameAction: GameActions.drawCards((context) => ({
                        player: context.player,
                        amount: 1
                    }))
                }
            }
        });
        this.plotModifiers({
            initiative: -1
        });
    }
}

CerseisWheelhouse.code = '02010';

export default CerseisWheelhouse;
