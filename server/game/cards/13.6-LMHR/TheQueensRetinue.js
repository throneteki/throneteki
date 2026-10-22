import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheQueensRetinue extends DrawCard {
    // The Queen's Retinue (13103)
    // Shadow (4).
    // Action: Put The Queen's Retinue into play from shadows. Then, each opponent draws 2 cards.
    setupCardAbilities() {
        this.action({
            title: 'Put into play',
            location: 'shadows',
            condition: (context) => context.player.canPutIntoPlay(context.source, 'outOfShadows'),
            message: '{player} uses {source} to put {source} into play from shadows',
            gameAction: GameActions.putIntoPlay((context) => ({
                card: context.source,
                playingType: 'outOfShadows'
            })).then({
                message: 'Then {player} has each opponent draw 2 cards',
                gameAction: GameActions.simultaneously((context) =>
                    context.game
                        .getOpponents(context.player)
                        .map((player) => GameActions.drawCards({ player, amount: 2 }))
                )
            })
        });
    }
}

TheQueensRetinue.code = '13103';

export default TheQueensRetinue;
