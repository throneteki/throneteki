import DrawCard from '../../drawcard.js';

class JoffreysCrossbow extends DrawCard {
    // Joffrey's Crossbow (26026)
    // If attached character is Joffrey Baratheon, he gains intimidate.
    // While attached character is attacking, unique characters must be chosen for [military] claim,
    // if able.
    setupCardAbilities(ability) {
        this.whileAttached({
            match: (card) => card.name === 'Joffrey Baratheon',
            effect: ability.effects.addKeyword('Intimidate')
        });
        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({ challengeType: 'military' }) &&
                this.parent &&
                this.parent.isAttacking(),
            targetController: 'any',
            match: (card) => card.getType() === 'character' && card.isUnique(),
            effect: ability.effects.mustChooseAsClaim()
        });
    }
}

JoffreysCrossbow.code = '26026';

export default JoffreysCrossbow;
