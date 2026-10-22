import DrawCard from '../../drawcard.js';

class Jhogo extends DrawCard {
    // Jhogo (02113)
    // While you control another Bloodrider character, Jhogo gains stealth.
    // While Jhogo is attacking, he gets +X STR, where X is the number of characters in the
    // defending player's dead pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.getNumberOfBloodriders() >= 1,
            match: this,
            effect: ability.effects.addKeyword('stealth')
        });
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            match: this,
            effect: ability.effects.dynamicStrength((card, context) =>
                context.source.getNumberOfDeadDefendingCharacters()
            )
        });
    }

    getNumberOfBloodriders() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.hasTrait('Bloodrider') && card.getType() === 'character' && card !== this
        );
    }

    getNumberOfDeadDefendingCharacters() {
        if (!this.game.isDuringChallenge()) {
            return 0;
        }

        return this.game.currentChallenge.defendingPlayer.deadPile.length;
    }
}

Jhogo.code = '02113';

export default Jhogo;
