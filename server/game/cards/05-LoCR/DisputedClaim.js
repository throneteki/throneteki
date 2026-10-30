import DrawCard from '../../drawcard.js';

function hasMostFactionPower(source) {
    let opponents = source.game.getOpponents(source.controller);
    return opponents.every((opponent) => source.controller.faction.power > opponent.faction.power);
}

class DisputedClaim extends DrawCard {
    // Disputed Claim (05026)
    // Bastard, Lord, or Lady character only.
    // While you have more power on your faction card than each opponent, attached character gets +2
    // STR and gains renown.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: ['Bastard', 'Lord', 'Lady'] });
        this.whileAttached({
            condition: (context) => hasMostFactionPower(context.source),
            effect: [ability.effects.modifyStrength(2), ability.effects.addKeyword('Renown')]
        });
    }
}

DisputedClaim.code = '05026';

export default DisputedClaim;
