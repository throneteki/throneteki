import DrawCard from '../../drawcard.js';

class DisputedClaim extends DrawCard {
    // Disputed Claim (05026)
    // Bastard, Lord, or Lady character only.
    // While you have more power on your faction card than each opponent, attached character gets +2
    // STR and gains renown.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: ['Bastard', 'Lord', 'Lady'] });
        this.whileAttached({
            condition: () => this.hasMostFactionPower(),
            effect: [ability.effects.modifyStrength(2), ability.effects.addKeyword('Renown')]
        });
    }

    hasMostFactionPower() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.every(
            (opponent) => this.controller.faction.power > opponent.faction.power
        );
    }
}

DisputedClaim.code = '05026';

export default DisputedClaim;
