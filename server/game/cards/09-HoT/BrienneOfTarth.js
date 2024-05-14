const DrawCard = require('../../drawcard.js');

class BrienneOfTarth extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
            },
            handler: () => {
                if (
                    this.getStrength() >= 10 &&
                    this.controller.anyCardsInPlay(
                        (card) => card !== this && card.getType() === 'character'
                    )
                ) {
                    this.game.promptForSelect(this.controller, {
                        cardCondition: (card) =>
                            card !== this &&
                            card.location === 'play area' &&
                            card.getType() === 'character',
                        onSelect: (player, card) => this.activateBonuses(card),
                        onCancel: () => this.activateBonuses(null),
                        source: this
                    });
                    return;
                }

                this.activateBonuses(null);
            }
        });
    }

    activateBonuses(otherCharacter) {
        let bonusMessages = [];
        let strength = this.getStrength();

        if (strength >= 6) {
            this.modifyPower(1);
            bonusMessages.push('gain 1 power');
        }

        if (strength >= 10 && otherCharacter) {
            this.untilEndOfPhase((ability) => ({
                match: otherCharacter,
                effect: ability.effects.modifyStrength(3)
            }));
            bonusMessages.push('give {2} +3 STR until end of phase');
        }

        if (strength >= 15) {
            this.controller.standCard(this);
            bonusMessages.push('stand {1}');

            if (this.controller.canDraw()) {
                this.controller.drawCardsToHand(1);
                bonusMessages.push('draw 1 card');
            }
        }

        this.game.addMessage(
            '{0} uses {1} to ' + bonusMessages.join(', '),
            this.controller,
            this,
            otherCharacter
        );
        return true;
    }
}

BrienneOfTarth.code = '09002';

module.exports = BrienneOfTarth;
