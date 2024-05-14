import DrawCard from '../../drawcard.js';

class OlennasStudy extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.mayInitiateAdditionalChallenge('intrigue')
        });

        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ challengeType: 'intrigue' }),
            match: (card) => card.isMatch({ type: 'character', unique: false }),
            targetController: 'any',
            effect: [
                ability.effects.cannotBeDeclaredAsAttacker(),
                ability.effects.cannotBeDeclaredAsDefender()
            ]
        });
    }
}

OlennasStudy.code = '16016';

export default OlennasStudy;
