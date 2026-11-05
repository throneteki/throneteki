import DrawCard from '../../drawcard.js';

class TheDrumm extends DrawCard {
    // The Drumm (12006)
    // While The Drumm is attacking in a [military] or [power] challenge, each character with an
    // [intrigue] icon cannot be declared as a defender.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge({ challengeType: ['military', 'power'] }) &&
                context.source.isAttacking(),
            match: (card) => card.getType() === 'character' && card.hasIcon('intrigue'),
            targetController: 'any',
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });
    }
}

TheDrumm.code = '12006';

export default TheDrumm;
