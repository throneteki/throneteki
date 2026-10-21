import DrawCard from '../../drawcard.js';

class NorthernEncampment extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        this.tracker = new DominanceTracker(this.game, this);
    }

    // Northern Encampment (06088)
    // Limited.
    // Northern Encampment cannot stand during the standing phase unless you have won dominance this
    // round.
    // Marshaling Action: Kneel Northern Encampment to gain 2 gold.
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

export default NorthernEncampment;
