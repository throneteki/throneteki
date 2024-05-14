import DrawCard from '../../drawcard.js';

class JonSnow extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.hasCharacterWithTrait('builder'),
            match: this,
            effect: ability.effects.addKeyword('stealth')
        });

        this.persistentEffect({
            condition: () => this.hasCharacterWithTrait('ranger'),
            match: this,
            effect: ability.effects.addKeyword('intimidate')
        });

        this.persistentEffect({
            condition: () => this.hasCharacterWithTrait('steward'),
            match: this,
            effect: ability.effects.addKeyword('insight')
        });
    }

    hasCharacterWithTrait(trait) {
        return this.controller.anyCardsInPlay(
            (card) => card.getType() === 'character' && card.hasTrait(trait)
        );
    }
}

JonSnow.code = '11065';

export default JonSnow;
