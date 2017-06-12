const DrawCard = require('../../../drawcard.js');

class ViserysTargaryen extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isAttacking(this),
            targetController: 'any',
            match: card => card.hasTrait('King') && card.getType() === 'character',
            effect: ability.effects.mustBeDeclaredAsDefender()
        });

        this.interrupt({
            when: {
                onPhaseEnded: (event, phase) => phase === 'dominance' && this.opponentHasNoKing()
            },
            handler: () => {
                this.modifyPower(1);
                this.game.addMessage('{0} uses {1} to gain 1 power on {1}', this.controller, this);
            }
        });
    }

    opponentHasNoKing() {
        let opponent = this.game.getOtherPlayer(this.controller);
        return opponent && !opponent.anyCardsInPlay(card => card.hasTrait('King'));
    }
}

ViserysTargaryen.code = '04014';

module.exports = ViserysTargaryen;
