import DrawCard from '../../drawcard.js';

class LemLemoncloak extends DrawCard {
    // Lem Lemoncloak (08058)
    // While you control no loyal characters, Lem Lemoncloak gets +2 STR and gains a [power] icon.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                !context.source.controller.anyCardsInPlay(
                    (card) => card.getType() === 'character' && card.isLoyal()
                ),
            match: this,
            effect: [ability.effects.modifyStrength(2), ability.effects.addIcon('power')]
        });
    }
}

LemLemoncloak.code = '08058';

export default LemLemoncloak;
