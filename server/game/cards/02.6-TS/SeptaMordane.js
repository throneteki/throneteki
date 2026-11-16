import DrawCard from '../../drawcard.js';

class SeptaMordane extends DrawCard {
    // Septa Mordane (02101)
    // While you control:
    // - Sansa Stark, she gets +2 STR and gains renown.
    // - Arya Stark, she gains an [intrigue] icon and "immune to opponents' plot effects."
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => controlsCharacterNamed(context, 'Sansa Stark'),
            match: this,
            effect: [ability.effects.modifyStrength(2), ability.effects.addKeyword('Renown')]
        });

        this.persistentEffect({
            condition: (context) => controlsCharacterNamed(context, 'Arya Stark'),
            match: this,
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

function controlsCharacterNamed(context, name) {
    return context.source.controller.anyCardsInPlay(
        (card) => card.name === name && card.getType() === 'character'
    );
}

SeptaMordane.code = '02101';

export default SeptaMordane;
