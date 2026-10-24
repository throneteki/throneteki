import PlotCard from '../../plotcard.js';

class AStormOfSwords extends PlotCard {
    // A Storm of Swords (01005)
    // You may initiate an additional [military] challenge during the challenges phase.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.mayInitiateAdditionalChallenge('military')
        });
    }
}

AStormOfSwords.code = '01005';

export default AStormOfSwords;
