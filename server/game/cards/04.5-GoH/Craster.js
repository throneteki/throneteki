import DrawCard from '../../drawcard.js';
import KillTracker from '../../EventTrackers/KillTracker.js';
import GameActions from '../../GameActions/index.js';

class Craster extends DrawCard {
    // Craster (04085)
    // Immune to Omen card effects.
    // Action: Sacrifice Craster to put each character that was killed this phase into play from its
    // owner's dead pile.
    setupCardAbilities(ability) {
        const tracker = new KillTracker(this.game);

        this.persistentEffect({
            match: (card, context) => card === context.source,
            effect: ability.effects.immuneTo((card) => card.hasTrait('Omen'))
        });
        this.action({
            title: 'Sacrifice to resurrect',
            cost: ability.costs.sacrificeSelf(),
            message:
                '{player} sacrifices {source} to put into play each character killed this phase',
            gameAction: GameActions.simultaneously(() =>
                tracker
                    .getCardsKilledThisPhase((card) => card.location === 'dead pile')
                    .map((card) => GameActions.putIntoPlay({ player: card.owner, card }))
            )
        });
    }
}

Craster.code = '04085';

export default Craster;
