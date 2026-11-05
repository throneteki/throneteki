import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NorthernRookery extends DrawCard {
    // Northern Rookery (02086)
    // Reaction: After you marshal Northern Rookery, draw 1 card.
    // +1 Reserve.
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source &&
                    event.playingType === 'marshal' &&
                    context.source.controller.canDraw()
            },
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

NorthernRookery.code = '02086';

export default NorthernRookery;
