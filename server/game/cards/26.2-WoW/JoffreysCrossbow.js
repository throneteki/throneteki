import DrawCard from '../../drawcard.js';

class JoffreysCrossbow extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            match: (card) => card.name === 'Joffrey Baratheon',
            effect: ability.effects.addKeyword('Intimidate')
        });
        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({ challengeType: 'military' }) &&
                this.parent.isAttacking(),
            match: (card) => card.getType() === 'character' && card.isUnique(),
            effect: ability.effects.mustChooseAsClaim()
        });
    }
}

JoffreysCrossbow.code = '26026';

export default JoffreysCrossbow;
