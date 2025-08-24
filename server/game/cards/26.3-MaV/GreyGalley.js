import DrawCard from '../../drawcard.js';
import CardEntersPlayTracker from '../../EventTrackers/CardEntersPlayTracker.js';

class GreyGalley extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = CardEntersPlayTracker.forPhase(this.game);

        this.persistentEffect({
            condition: () => this.controller.anyCardsInPlay({ type: 'character', defending: true }),
            targetController: 'current',
            effect: ability.effects.contributeStrength(this, this.getAmount())
        });
    }

    getAmount() {
        return this.tracker.hasComeOutOfShadows(this) ? 3 : 1;
    }
}

GreyGalley.code = '26050';

export default GreyGalley;
