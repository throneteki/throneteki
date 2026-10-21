import DrawCard from '../../drawcard.js';

class DefenderOfTheWall extends DrawCard {
    // Defender of the Wall (06085)
    // No attachments except Weapon.
    // While Defender of the Wall is defending, it gets +2 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isDefending(),
            match: this,
            effect: ability.effects.modifyStrength(2)
        });
    }
}

DefenderOfTheWall.code = '06085';

export default DefenderOfTheWall;
