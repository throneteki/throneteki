import DrawCard from '../../drawcard.js';

class SentinelStand extends DrawCard {
    // Sentinel Stand (25010)
    // While Sentinel Stand is standing, each character you control with 1 or fewer challenge icons
    // gets +2 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !context.source.kneeled,
            match: (card) => card.getType() === 'character' && card.getNumberOfIcons() <= 1,
            effect: ability.effects.modifyStrength(2)
        });
    }
}

SentinelStand.code = '25010';

export default SentinelStand;
