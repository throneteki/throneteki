import DrawCard from '../../drawcard.js';

class YoungSpearwife extends DrawCard {
    // Young Spearwife (03040)
    // While you have less power on your faction card than an opponent, Young Spearwife gains
    // stealth.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.hasLessFactionPower(),
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
