import PlotCard from '../../plotcard.js';

class TheWarOfTheFiveKings extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyClaim(() => this.getNumberOfRivals().length)
        });
    }

    getNumberOfRivals() {
        return this.game
            .getOpponents(this.controller)
            .map((player) => player.isRival(this.controller));
    }
}

TheWarOfTheFiveKings.code = '26079';

export default TheWarOfTheFiveKings;
