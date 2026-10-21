import DrawCard from '../../drawcard.js';

class TourneyLance extends DrawCard {
    // Tourney Lance (09021)
    // Knight character only.
    // Attached character gets +1 STR.
    // While attached character is attacking alone, the defending player cannot declare more than 1
    // character as a defender.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Knight' });

        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });

        this.persistentEffect({
            condition: () =>
                this.parent && this.game.isDuringChallenge({ attackingAlone: this.parent }),
            targetController: 'opponent',
            effect: ability.effects.setDefenderMaximum(1)
        });
    }
}

TourneyLance.code = '09021';

export default TourneyLance;
