import DrawCard from '../../drawcard.js';
import GenericTracker from '../../EventTrackers/GenericTracker.js';
import GameActions from '../../GameActions/index.js';

class NorthernEncampment extends DrawCard {
    // Northern Encampment (06088)
    // Limited.
    // Northern Encampment cannot stand during the standing phase unless you have won dominance this
    // round.
    // Marshaling Action: Kneel Northern Encampment to gain 2 gold.
    setupCardAbilities(ability) {
        const tracker = GenericTracker.forRound(this.game, 'onDominanceDetermined');
        this.persistentEffect({
            condition: (context) =>
                context.game.currentPhase === 'standing' &&
                !tracker.some((event) => event.winner === context.source.controller),
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

NorthernEncampment.code = '06088';

export default NorthernEncampment;
