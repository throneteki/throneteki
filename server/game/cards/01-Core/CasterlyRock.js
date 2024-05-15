import DrawCard from '../../drawcard.js';

class CasterlyRock extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.mayInitiateAdditionalChallenge('intrigue')
        });
    }
}

CasterlyRock.code = '01097';

export default CasterlyRock;
