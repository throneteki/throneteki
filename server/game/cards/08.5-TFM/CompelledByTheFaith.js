import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class CompelledByTheFaith extends PlotCard {
    // Compelled by the Faith (08100)
    // When Revealed: Move each power from each card in play to its controller's faction card.
    setupCardAbilities() {
        this.whenRevealed({
            message:
                "{player} uses {source} to move all power from each card in play to its controller's faction card",
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .filterCardsInPlay((card) => card.power > 0)
                    .map((card) =>
                        GameActions.movePower({
                            from: card,
                            to: card.controller.faction,
                            amount: card.power
                        })
                    )
            )
        });
    }
}

CompelledByTheFaith.code = '08100';

export default CompelledByTheFaith;
