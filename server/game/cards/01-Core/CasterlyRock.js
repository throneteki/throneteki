import DrawCard from '../../drawcard.js';

class CasterlyRock extends DrawCard {
    // Casterly Rock (01097)
    // You may initiate an additional [intrigue] challenge during the challenges phase.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.mayInitiateAdditionalChallenge('intrigue')
        });
    }
}

CasterlyRock.code = '01097';

export default CasterlyRock;
