import DrawCard from '../../drawcard.js';

class TheQueenOfThorns extends DrawCard {
    // The Queen of Thorns (16015)
    // While The Queen of Thorns is standing, opponents cannot initiate [intrigue] challenges
    // against you.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !context.source.kneeled,
            targetController: 'opponent',
            effect: ability.effects.cannotInitiateChallengeType('intrigue')
        });
    }
}

TheQueenOfThorns.code = '16015';

export default TheQueenOfThorns;
