const DrawCard = require('../../../drawcard.js');

class DominanceTracker {
    constructor(game, card) {
        this.hasWonDominanceThisRound = undefined;
        game.on('onDominanceDetermined', (event, winner) => this.hasWonDominanceThisRound = card.controller === winner);
        game.on('onRoundEnded', () => this.hasWonDominanceThisRound = undefined);
    }
}

class NorthernEncampment extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        this.tracker = new DominanceTracker(this.game, this);
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentPhase === 'standing' && !this.tracker.hasWonDominanceThisRound,
            match: this,
            effect: ability.effects.cannotBeStood()
        });

        this.action({
            title: 'Kneel this card to gain 2 gold',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            handler: context => {
                this.game.addGold(context.player, 2);
                this.game.addMessage('{0} kneels {1} to gain 2 gold', context.player, this);
            }
        });
    }
}

NorthernEncampment.code = '06088';

module.exports = NorthernEncampment;
