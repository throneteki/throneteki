import DrawCard from '../../drawcard.js';

class DevoutFreerider extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentPhase === 'challenge',
            targetController: 'any',
            effect: ability.effects.cannotGainGold()
        });
    }
}

DevoutFreerider.code = '05040';

export default DevoutFreerider;
