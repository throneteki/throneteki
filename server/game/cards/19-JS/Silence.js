import DrawCard from '../../drawcard.js';

class Silence extends DrawCard {
    // Silence (19004)
    // Each Raider character you control gains pillage.
    // While an opponent has 10 or more cards in their discard pile, each Raider character you
    // control gets +1 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.getType() === 'character' &&
                card.controller === this.controller &&
                card.hasTrait('Raider'),
            effect: ability.effects.addKeyword('pillage')
        });
        this.persistentEffect({
            condition: () =>
                this.game
                    .getOpponents(this.controller)
                    .some((opponent) => opponent.discardPile.length >= 10),
            match: (card) =>
                card.getType() === 'character' &&
                card.controller === this.controller &&
                card.hasTrait('Raider'),
            effect: ability.effects.modifyStrength(1)
        });
    }
}

Silence.code = '19004';

export default Silence;
