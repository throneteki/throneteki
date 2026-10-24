import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheQueensRetinue extends DrawCard {
    // The Queen's Retinue (17137)
    // Shadow (4).
    // Action: Put The Queen's Retinue into play from shadows. Then, each opponent may draw 2 cards.
    setupCardAbilities() {
        this.action({
            title: 'Put into play',
            location: 'shadows',
            message: '{player} uses {source} to put {source} into play from shadows',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source
            })).then({
                gameAction: GameActions.simultaneously((context) =>
                    context.game.getOpponents(context.player).map((opponent) =>
                        GameActions.may({
                            player: opponent,
                            title: 'Draw 2 cards?',
                            message: '{choosingPlayer} draws 2 cards for {source}',
                            gameAction: GameActions.drawCards({ player: opponent, amount: 2 })
                        })
                    )
                )
            })
        });
    }
}

TheQueensRetinue.code = '17137';

export default TheQueensRetinue;
