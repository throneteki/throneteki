import DrawCard from '../../drawcard.js';

class LemLemoncloak extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                !this.controller.anyCardsInPlay(
                    (card) => card.getType() === 'character' && card.isLoyal()
                ),
            match: this,
            effect: [ability.effects.modifyStrength(2), ability.effects.addIcon('power')]
        });
    }
}

LemLemoncloak.code = '08058';

export default LemLemoncloak;
