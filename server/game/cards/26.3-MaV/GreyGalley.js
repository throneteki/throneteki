import DrawCard from '../../drawcard.js';
import CardEntersPlayTracker from '../../EventTrackers/CardEntersPlayTracker.js';

class GreyGalley extends DrawCard {
    // Grey Galley (26050)
    // Shadow (1).
    // Grey Galley contributes 1 STR to your side during any challenge in which you control a
    // defending character. (3 STR instead if Grey Galley came out of shadows this phase.)
    setupCardAbilities(ability) {
        const tracker = CardEntersPlayTracker.forPhase(this.game);

        this.persistentEffect({
            condition: (context) =>
                !tracker.hasComeOutOfShadows(context.source) && controlsDefender(context),
            targetController: 'current',
            effect: ability.effects.contributeStrength(this, 1)
        });
        this.persistentEffect({
            condition: (context) =>
                tracker.hasComeOutOfShadows(context.source) && controlsDefender(context),
            targetController: 'current',
            effect: ability.effects.contributeStrength(this, 3)
        });
    }
}

function controlsDefender(context) {
    return context.source.controller.anyCardsInPlay({ type: 'character', defending: true });
}

GreyGalley.code = '26050';

export default GreyGalley;
