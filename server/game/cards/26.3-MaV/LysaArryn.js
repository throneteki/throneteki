import DrawCard from '../../drawcard.js';

class LysaArryn extends DrawCard {
    // Lysa Arryn (26057)
    // Each House Arryn character you control is considered to be loyal.
    // While your initiative value is 0, Lysa Arryn gains the keywords of each other loyal character
    // you control.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.controller === this.controller &&
                card.getType() === 'character' &&
                card.hasTrait('House Arryn'),
            effect: ability.effects.setLoyal(true)
        });

        this.persistentEffect({
            condition: () => this.controller.getInitiative() === 0,
            match: this,
            effect: ability.effects.dynamicKeywordSources(
                (card) =>
                    card !== this &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    card.isLoyal()
            )
        });
    }
}

LysaArryn.code = '26057';

export default LysaArryn;
