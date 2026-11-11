import DrawCard from '../../drawcard.js';

class Shaggydog extends DrawCard {
    // Shaggydog (03014)
    // No attachments.
    // While you control Rickon Stark, he gets +2 STR and gains a [military] icon.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Rickon Stark',
            effect: [ability.effects.modifyStrength(2), ability.effects.addIcon('military')]
        });
    }
}

Shaggydog.code = '03014';

export default Shaggydog;
