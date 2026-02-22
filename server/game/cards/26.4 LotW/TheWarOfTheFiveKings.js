import PlotCard from '../../plotcard.js';

class TheWarOfTheFiveKings extends PlotCard {
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
