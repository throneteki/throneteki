import DrawCard from '../../drawcard.js';

class KhalDrogo extends DrawCard {
    // Khal Drogo (01162)
    // Renown.
    // You may initiate an additional [military] challenge during the challenges phase.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.mayInitiateAdditionalChallenge('military')
        });
    }
}

KhalDrogo.code = '01162';

export default KhalDrogo;
