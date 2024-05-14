import DrawCard from '../../drawcard.js';

class TheQueenOfThorns extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.kneeled,
            targetController: 'opponent',
            effect: ability.effects.cannotInitiateChallengeType('intrigue')
        });
    }
}

TheQueenOfThorns.code = '16015';

export default TheQueenOfThorns;
