import DrawCard from '../../drawcard.js';

class Silence extends DrawCard {
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
