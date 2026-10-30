import PlotCard from '../../plotcard.js';

function getNumberOfFactions(source) {
    let charactersInPlay = source.controller.filterCardsInPlay(
        (card) => card.getType() === 'character' && !card.isFaction('neutral')
    );
    let factionsInPlay = [];

    for (let card of charactersInPlay) {
        let factions = card.getFactions();
        for (let faction of factions) {
            if (!factionsInPlay.includes(faction)) {
                factionsInPlay.push(faction);
            }
        }
    }

    return factionsInPlay.length;
}

class CommonCause extends PlotCard {
    // Common Cause (00021)
    // X is the number of different faction affiliations among characters you control.
    // Draft format only.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyClaim((card, context) =>
                getNumberOfFactions(context.source)
            )
        });
    }
}

CommonCause.code = '00021';

export default CommonCause;
