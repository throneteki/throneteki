import DrawCard from '../../drawcard.js';

function getNumberOfBloodriders(source) {
    return source.controller.getNumberOfCardsInPlay(
        (card) => card.hasTrait('Bloodrider') && card.getType() === 'character' && card !== source
    );
}

function getNumberOfDeadDefendingCharacters(source) {
    if (!source.game.isDuringChallenge()) {
        return 0;
    }

    return source.game.currentChallenge.defendingPlayer.deadPile.length;
}

class Jhogo extends DrawCard {
    // Jhogo (02113)
    // While you control another Bloodrider character, Jhogo gains stealth.
    // While Jhogo is attacking, he gets +X STR, where X is the number of characters in the
    // defending player's dead pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => getNumberOfBloodriders(context.source) >= 1,
            match: this,
            effect: ability.effects.addKeyword('stealth')
        });
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            match: this,
            effect: ability.effects.dynamicStrength((card, context) =>
                getNumberOfDeadDefendingCharacters(context.source)
            )
        });
    }
}

Jhogo.code = '02113';

export default Jhogo;
