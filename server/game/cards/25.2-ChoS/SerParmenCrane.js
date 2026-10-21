import DrawCard from '../../drawcard.js';

class SerParmenCrane extends DrawCard {
    // Ser Parmen Crane (25035)
    // While you control another Rainbow Guard character, Ser Parmen Crane gains renown.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.controller.anyCardsInPlay(
                    (card) =>
                        card !== context.source &&
                        card.getType() === 'character' &&
                        card.hasTrait('Rainbow Guard')
                ),
            match: this,
            effect: ability.effects.addKeyword('renown')
        });
    }
}

SerParmenCrane.code = '25035';

export default SerParmenCrane;
