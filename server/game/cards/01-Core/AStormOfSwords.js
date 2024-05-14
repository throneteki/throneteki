import PlotCard from '../../plotcard.js';

class AStormOfSwords extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.mayInitiateAdditionalChallenge('military')
        });
    }
}

AStormOfSwords.code = '01005';

export default AStormOfSwords;
