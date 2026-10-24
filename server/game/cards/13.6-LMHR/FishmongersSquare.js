import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FishmongersSquare extends DrawCard {
    // Fishmonger's Square (13112)
    // Marshaling Action: If there are 10 or more cards in an opponent's discard pile, kneel
    // Fishmonger's Square to draw 1 card and gain 1 gold.
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw card and gain gold',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            condition: (context) =>
                context.game
                    .getOpponents(context.player)
                    .some((opponent) => opponent.discardPile.length >= 10),
            message: '{player} kneels {source} and {gameAction}',
            gameAction: GameActions.simultaneously([
                GameActions.drawCards((context) => ({ player: context.player, amount: 1 })),
                GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
            ])
        });
    }
}

FishmongersSquare.code = '13112';

export default FishmongersSquare;
