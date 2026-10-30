import DrawCard from '../../drawcard.js';

class DaceyMormont extends DrawCard {
    // Dacey Mormont (06061)
    // Renown.
    // X is the number of [stark] characters you control.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength((card) =>
                card.controller.getNumberOfCardsInPlay(
                    (character) =>
                        character.getType() === 'character' && character.isFaction('stark')
                )
            )
        });
    }
}

DaceyMormont.code = '06061';

export default DaceyMormont;
