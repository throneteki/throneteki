const DrawCard = require('../../drawcard.js');

class SamwellTarly extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.isParticipating() && this.controller.getTotalReserve() >= 6
            },
            handler: () => {
                let reserve = this.controller.getTotalReserve();
                if(reserve >= 10 && this.controller.anyCardsInPlay(card => card !== this && card.getType() === 'character' && card.getTraits().some(trait => this.hasTrait(trait)))) {
                    this.game.promptForSelect(this.controller, {
                        cardCondition: card => card !== this && card.location === 'play area' && card.getType() === 'character' && card.getTraits().some(trait => this.hasTrait(trait)),
                        onSelect: (player, card) => this.activateBonuses(reserve, card),
                        onCancel: () => this.activateBonuses(reserve, null),
                        source: this
                    });
                    return;
                }

                this.activateBonuses(reserve, null);
            }
        });
    }

    activateBonuses(reserve, otherCharacter) {
        let bonusMessages = [];

        if(reserve >= 6) {
            this.controller.drawCardsToHand(1);
            bonusMessages.push('draw 1 card');
        }

        if(reserve >= 8) {
            this.game.addPower(this.controller, 1);
            bonusMessages.push('gain 1 power for their faction');
        }

        if(reserve >= 10 && otherCharacter) {
            this.controller.standCard(otherCharacter);
            bonusMessages.push('stand {2}');
        }

        this.game.addMessage('{0} uses {1} to ' + bonusMessages.join(', '), this.controller, this, otherCharacter);
        return true;
    }
}

SamwellTarly.code = '22013';

module.exports = SamwellTarly;
