import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class BitingCold extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: (context) => {
                let charactersToMove = this.game.filterCardsInPlay(
                    (card) =>
                        card.getType() === 'character' &&
                        card.getPrintedCost() <= 3 &&
                        card.attachments.length === 0
                );

                if (charactersToMove.length > 0) {
                    this.game.resolveGameAction(
                        GameActions.simultaneously(() =>
                            charactersToMove.map((card) =>
                                GameActions.returnCardToDeck({
                                    card,
                                    bottom: true,
                                    allowSave: true
                                })
                            )
                        ),
                        context
                    );
                    this.game.addMessage(
                        '{0} uses {1} to return each character with printed cost 3 or less and no attachments to the bottom of the deck',
                        this.controller
                    );
                }
            }
        });
    }
}

BitingCold.code = '00380';

export default BitingCold;
