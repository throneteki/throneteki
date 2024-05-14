const DrawCard = require('../../drawcard.js');

class NorthernEncampment extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        this.tracker = new DominanceTracker(this.game, this);
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.currentPhase === 'standing' && !this.tracker.hasWonDominanceThisRound,
            match: this,
            effect: ability.effects.cannotBeStood()
        });

        this.action({
            title: 'Gain 2 gold',
            phase: 'marshal',
            condition: () => this.controller.canGainGold(),
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                let gold = this.game.addGold(context.player, 2);
                this.game.addMessage('{0} kneels {1} to gain {2} gold', context.player, this, gold);
            }
        });
    }
}

class DominanceTracker {
    constructor(game, card) {
        this.hasWonDominanceThisRound = undefined;
        game.on(
            'onDominanceDetermined',
            (event) => (this.hasWonDominanceThisRound = card.controller === event.winner)
        );
        game.on('onRoundEnded', () => (this.hasWonDominanceThisRound = undefined));
    }
}

NorthernEncampment.code = '06088';

module.exports = NorthernEncampment;
