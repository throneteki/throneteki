import DrawCard from '../../drawcard.js';

class Jhogo extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.getNumberOfBloodriders() >= 1,
            match: this,
            effect: ability.effects.addKeyword('stealth')
        });
        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: this,
            effect: ability.effects.dynamicStrength(() => this.getNumberOfDeadDefendingCharacters())
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
