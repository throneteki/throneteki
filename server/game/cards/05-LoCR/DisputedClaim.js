import DrawCard from '../../drawcard.js';

class DisputedClaim extends DrawCard {
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
