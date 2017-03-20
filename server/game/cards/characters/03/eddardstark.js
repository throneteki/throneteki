const DrawCard = require('../../../drawcard.js');

class EddardStark extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onRenown: (event, challenge, card) => card === this && this.isNotParticipatingAlone()
            },
            target: {
                activePromptTitle: 'Select character to gain power',
                cardCondition: card => this.cardCondition(this.game.currentChallenge, card)
            },
            handler: context => {
                context.target.modifyPower(1);
                this.game.addMessage('{0} uses {1} to allow {2} to gain 1 power', context.player, this, context.target);
            }
        });
    }

    cardCondition(challenge, card) {
        return card !== this && card.getType() === 'character' && challenge.isParticipating(card);
    }

    onCardSelected(player, card) {
        if(this.isBlank() || this.controller !== player) {
            return;
        }

        card.modifyPower(1);

        this.game.addMessage('{0} uses {1} to allow {2} to gain 1 power', player, this, card);

        return true;
    }

    isNotParticipatingAlone() {
        if(this.game.currentChallenge.isAttacking(this) && this.game.currentChallenge.attackers.length > 1) {
            return true;
        }
        if(this.game.currentChallenge.isDefending(this) && this.game.currentChallenge.defenders.length > 1) {
            return true;
        }

        return false;
    }
}

EddardStark.code = '03003';

module.exports = EddardStark;
