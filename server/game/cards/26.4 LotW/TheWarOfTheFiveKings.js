import PlotCard from '../../plotcard.js';

function getNumberOfRivals(source) {
    return source.game
        .getOpponents(source.controller)
        .filter((player) => player.isRival(source.controller)).length;
}

class TheWarOfTheFiveKings extends PlotCard {
    // The War of the Five Kings (26079)
    // Raise the claim value on The War of the Five Kings by 1 for each rival you have.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyClaim((card, context) =>
                getNumberOfRivals(context.source)
            )
        });
    }
}

TheWarOfTheFiveKings.code = '26079';

export default TheWarOfTheFiveKings;
