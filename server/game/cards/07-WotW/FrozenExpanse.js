import PlotCard from '../../plotcard.js';

class FrozenExpanse extends PlotCard {
    // Frozen Expanse (07052)
    // Each character with STR 2 or lower cannot stand.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.getType() === 'character' && card.getStrength() <= 2,
            targetController: 'any',
            effect: ability.effects.cannotBeStood()
        });
    }
}

FrozenExpanse.code = '07052';

export default FrozenExpanse;
