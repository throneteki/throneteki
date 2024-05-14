import DrawCard from '../../drawcard.js';

class BoltonFlayer extends DrawCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge'
            },
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.getPrintedCost() === this.lowestPrintedCost() &&
                    card.location === 'play area'
            },
            handler: (context) => {
                this.game.killCharacter(context.target, { allowSave: false });
                this.game.addMessage(
                    '{0} uses {1} to kill {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }

    lowestPrintedCost() {
        let charactersInPlay = this.game.filterCardsInPlay(
            (card) => card.getType() === 'character' && card.hasPrintedCost()
        );
        let costs = charactersInPlay.map((card) => card.getPrintedCost());
        return costs.reduce((lowest, cost) => Math.min(lowest, cost));
    }
}

BoltonFlayer.code = '11002';

export default BoltonFlayer;
