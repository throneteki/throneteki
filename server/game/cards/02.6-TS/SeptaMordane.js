import DrawCard from '../../drawcard.js';

class SeptaMordane extends DrawCard {
    // Septa Mordane (02101)
    // While you control:
    // - Sansa Stark, she gets +2 STR and gains renown.
    // - Arya Stark, she gains an [intrigue] icon and "immune to opponents' plot effects."
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Sansa Stark',
            effect: [ability.effects.modifyStrength(2), ability.effects.addKeyword('Renown')]
        });

        this.persistentEffect({
            match: (card) => card.name === 'Arya Stark',
            effect: [
                ability.effects.addIcon('intrigue'),
                ability.effects.immuneTo(
                    (card, arg, context) =>
                        card.controller !== context.source.controller && card.getType() === 'plot'
                )
            ]
        });
    }
}

SeptaMordane.code = '02101';

export default SeptaMordane;
