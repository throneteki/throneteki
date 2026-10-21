import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BoltonFlayer extends DrawCard {
    // Bolton Flayer (11002)
    // Shadow (2).
    // Forced Interrupt: When the challenges phase ends, choose and kill a character with the lowest
    // printed cost (cannot be saved).
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge'
            },
            target: {
                cardCondition: (card, context) =>
                    card.getType() === 'character' &&
                    card.hasPrintedCost() &&
                    card.getPrintedCost() === lowestPrintedCost(context.game)
            },
            message: '{player} uses {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target, allowSave: false }))
        });
    }
}

function lowestPrintedCost(game) {
    const costs = game
        .filterCardsInPlay((card) => card.getType() === 'character' && card.hasPrintedCost())
        .map((card) => card.getPrintedCost());
    return Math.min(...costs);
}

BoltonFlayer.code = '11002';

export default BoltonFlayer;
