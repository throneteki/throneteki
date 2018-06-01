const DrawCard = require('../../drawcard');

class BoltonFlayer extends DrawCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: event => event.phase === 'challenge'
            },
            target: {
                cardCondition: card => card.getType() === 'character' && card.getPrintedCost() === this.lowestPrintedCost()
            },
            handler: context => {
                this.game.killCharacter(context.target, false);
                this.game.addMessage('{0} uses {1} to kill {2}', this.controller, this, context.target);
            }
        });
    }

    lowestPrintedCost() {
        let charactersInPlay = this.game.filterCardsInPlay(card => card.getType() === 'character');
        let costs = charactersInPlay.map(card => card.getPrintedCost());
        return costs.reduce((lowest, cost) => Math.min(lowest, cost));
    }
}

BoltonFlayer.code = '11002';

module.exports = BoltonFlayer;
