import DrawCard from '../../drawcard.js';

function hasLessFactionPower(source) {
    let opponents = source.game.getOpponents(source.controller);
    return opponents.some((opponent) => source.controller.faction.power < opponent.faction.power);
}

class YoungSpearwife extends DrawCard {
    // Young Spearwife (03040)
    // While you have less power on your faction card than an opponent, Young Spearwife gains
    // stealth.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => hasLessFactionPower(context.source),
            match: this,
            effect: ability.effects.addKeyword('Stealth')
        });
    }
}

YoungSpearwife.code = '03040';

export default YoungSpearwife;
