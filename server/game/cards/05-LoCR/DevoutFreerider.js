import DrawCard from '../../drawcard.js';

class DevoutFreerider extends DrawCard {
    // Devout Freerider (05040)
    // During the challenges phase, each player cannot gain gold.
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
