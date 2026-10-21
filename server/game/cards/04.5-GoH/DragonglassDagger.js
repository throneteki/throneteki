import DrawCard from '../../drawcard.js';

class DragonglassDagger extends DrawCard {
    // Dragonglass Dagger (04086)
    // [thenightswatch] character only.
    // While attached character is participating in a challenge, it gets +2 STR and is immune to
    // opponent's character abilities.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'thenightswatch' });
        this.whileAttached({
            condition: () => this.parent.isParticipating(),
            effect: [
                ability.effects.modifyStrength(2),
                ability.effects.immuneTo(
                    (card) => card.controller !== this.controller && card.getType() === 'character'
                )
            ]
        });
    }
}

DragonglassDagger.code = '04086';

export default DragonglassDagger;
