import DrawCard from '../../drawcard.js';

class JoustingKnight extends DrawCard {
    // Jousting Knight (09016)
    // Jousting Knight does not contribute its STR to a challenge unless it is attacking or
    // defending alone.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                !context.game.isDuringChallenge({ attackingAlone: context.source }) &&
                !context.game.isDuringChallenge({ defendingAlone: context.source }),
            match: this,
            effect: ability.effects.doesNotContributeStrength()
        });
    }
}

JoustingKnight.code = '09016';

export default JoustingKnight;
