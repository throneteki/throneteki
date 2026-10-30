import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class TheStranger extends PlotCard {
    // The Stranger (20059)
    // When Revealed: Each player chooses a character controlled by an opponent. Then, kill each
    // character with the same printed cost as the chosen characters.
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller !== context.choosingPlayer
            },
            message:
                '{player} uses {source} to kill each character with the same printed cost as the chosen characters',
            gameAction: GameActions.simultaneously((context) => {
                const printedCosts = context.targets.selections
                    .map((selection) => selection.value)
                    .filter((card) => !!card)
                    .map((card) => card.getPrintedCost());
                return context.game
                    .filterCardsInPlay(
                        (card) =>
                            card.getType() === 'character' &&
                            card.hasPrintedCost() &&
                            printedCosts.includes(card.getPrintedCost())
                    )
                    .map((card) => GameActions.kill({ card }));
            })
        });
    }
}

TheStranger.code = '20059';

export default TheStranger;
