import PlotCard from '../../plotcard.js';

class ATourneyForTheKing extends PlotCard {
    // A Tourney for the King (02059)
    // Each Knight character you control gains renown and "immune to opponents' events."
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.getType() === 'character' && card.hasTrait('Knight'),
            targetController: 'current',
            effect: [
                ability.effects.addKeyword('Renown'),
                ability.effects.immuneTo(
                    (card, arg, context) =>
                        card.controller !== context.source.controller && card.getType() === 'event'
                )
            ]
        });
    }
}

ATourneyForTheKing.code = '02059';

export default ATourneyForTheKing;
