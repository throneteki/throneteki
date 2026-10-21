import DrawCard from '../../drawcard.js';

class BloodOfValyria extends DrawCard {
    // Blood of Valyria (27014)
    // Unique [targaryen] character only.
    // Attached character's STR cannot be reduced by card effects.
    // Attached character gains insight during [power] challenges.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true, faction: 'targaryen' });
        this.whileAttached({
            effect: ability.effects.cannotDecreaseStrength(
                (context) => context.resolutionStage === 'effect'
            )
        });
        this.whileAttached({
            condition: () => this.game.isDuringChallenge({ challengeType: 'power' }),
            effect: ability.effects.addKeyword('insight')
        });
    }
}

BloodOfValyria.code = '27014';

export default BloodOfValyria;
