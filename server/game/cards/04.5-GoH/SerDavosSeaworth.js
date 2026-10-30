import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerDavosSeaworth extends DrawCard {
    // Ser Davos Seaworth (04087)
    // Stealth.
    // Reaction: After Ser Davos Seaworth bypasses a non-loyal character using stealth, either: draw
    // 1 card, or gain 1 gold.
    setupCardAbilities() {
        this.reaction({
            when: {
                onBypassedByStealth: (event, context) =>
                    event.source === context.source && !event.target.isLoyal()
            },
            choices: {
                'Draw 1 card': {
                    message: '{player} uses {source} to draw 1 card',
                    gameAction: GameActions.drawCards((context) => ({
                        player: context.player,
                        amount: 1
                    }))
                },
                'Gain 1 gold': {
                    message: '{player} uses {source} to gain 1 gold',
                    gameAction: GameActions.gainGold((context) => ({
                        player: context.player,
                        amount: 1
                    }))
                }
            }
        });
    }
}

SerDavosSeaworth.code = '04087';

export default SerDavosSeaworth;
