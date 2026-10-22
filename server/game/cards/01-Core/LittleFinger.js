import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LittleFinger extends DrawCard {
    // Littlefinger (01028)
    // Reaction: After you marshal Littlefinger, draw 2 cards.
    // +1 Income.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source &&
                    event.playingType === 'marshal' &&
                    context.source.controller.canDraw()
            },
            message: '{player} uses {source} to draw 2 cards',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 2 }))
        });
        this.plotModifiers({
            gold: 1
        });
    }
}

LittleFinger.code = '01028';

export default LittleFinger;
