import PlotCard from '../../plotcard.js';

class TheWarOfTheFiveKings extends PlotCard {
    // The War of the Five Kings (26079)
    // Raise the claim value on The War of the Five Kings by 1 for each rival you have.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyClaim(() => this.getNumberOfRivals())
        });
    }

    getNumberOfRivals() {
        return this.game
            .getOpponents(this.controller)
            .filter((player) => player.isRival(this.controller)).length;
    }
}

TheWarOfTheFiveKings.code = '26079';

export default TheWarOfTheFiveKings;
