import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
            condition: (context) =>
                context.game.currentPhase === 'standing' &&
                !context.source.tracker.hasWonDominanceThisRound,
            match: this,
            effect: ability.effects.cannotBeStood()
        });

        this.action({
            title: 'Gain 2 gold',
            phase: 'marshal',
            condition: (context) => context.source.controller.canGainGold(),
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to gain 2 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 2 }))
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
