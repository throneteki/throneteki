const DrawCard = require('../../drawcard');

class DothrakiSteed extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction(card => card.getType() === 'character' && card.attachments.every(attachment => attachment === this || attachment.name !== 'Dothraki Steed'));

        this.whileAttached({
            condition: () => this.parent.isAttacking() && this.game.isDuringChallenge({ initiated: true, attackingPlayer: this.controller }),
            effect: ability.effects.dynamicStrength(() => this.getSTR())
        });
    }

    getSTR() {
        return this.parent.hasTrait('Dothraki') ? 3 : 1;
    }
}

DothrakiSteed.code = '14036';

module.exports = DothrakiSteed;
