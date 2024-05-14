import PlotCard from '../../plotcard.js';

class FrozenExpanse extends PlotCard {
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
