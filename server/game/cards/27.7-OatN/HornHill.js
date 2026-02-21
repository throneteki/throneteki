import DrawCard from '../../drawcard.js';

class HornHill extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: 1
        });
        this.persistentEffect({
            condition: () => this.isAttackingDuringChallengeNumber(1),
            match: (card) => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }
}

HornHill.code = '27510';
HornHill.version = '1.0.0';

export default HornHill;
