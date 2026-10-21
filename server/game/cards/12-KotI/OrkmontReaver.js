import DrawCard from '../../drawcard.js';

class OrkmontReaver extends DrawCard {
    // Orkmont Reaver (12015)
    // Pillage.
    // While an opponent has 10 or more cards in his or her discard pile, Orkmont Reaver gains
    // stealth.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game
                    .getOpponents(this.controller)
                    .some((opponent) => opponent.discardPile.length >= 10),
            match: this,
            effect: ability.effects.addKeyword('stealth')
        });
    }
}

OrkmontReaver.code = '12015';

export default OrkmontReaver;
