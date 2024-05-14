const DrawCard = require('../../drawcard.js');

class ViserysTargaryen extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            targetController: 'any',
            match: (card) => card.hasTrait('King') && card.getType() === 'character',
            effect: ability.effects.mustBeDeclaredAsDefender()
        });

        this.interrupt({
            when: {
                onPhaseEnded: (event) =>
                    event.phase === 'dominance' &&
                    this.opponentHasNoKing() &&
                    this.allowGameAction('gainPower')
            },
            handler: () => {
                this.modifyPower(1);
                this.game.addMessage('{0} uses {1} to gain 1 power on {1}', this.controller, this);
            }
        });
    }

    opponentHasNoKing() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.every(
            (opponent) => !opponent.anyCardsInPlay((card) => card.hasTrait('King'))
        );
    }
}

ViserysTargaryen.code = '04014';

module.exports = ViserysTargaryen;
