import DrawCard from '../../drawcard.js';

class YoungSpearwife extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.hasLessFactionPower(),
            match: this,
            effect: ability.effects.addKeyword('Stealth')
        });
    }

    hasLessFactionPower() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.some((opponent) => this.controller.faction.power < opponent.faction.power);
    }
}

YoungSpearwife.code = '03040';

export default YoungSpearwife;
