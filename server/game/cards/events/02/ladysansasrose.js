const DrawCard = require('../../../drawcard.js');

class LadySansasRose extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    this.hasSingleParticipatingChar() &&
                    this.hasParticipatingKnight())
            },
            handler: (context) => {
                let power = this.hasLadyCharacter() ? 3 : 1;
                let participatingCard = this.controller.filterCardsInPlay(card => {
                    return (this.game.currentChallenge.isParticipating(card) &&
                    card.hasTrait('Knight') && 
                    card.getType() === 'character');
                });
                participatingCard[0].modifyPower(power);
                this.game.addMessage('{0} plays {1} to have {2} gain {3} power', context.player, this, participatingCard[0], power);
            }
        });
    }

    hasSingleParticipatingChar() {
        if(this.game.currentChallenge.attackingPlayer === this.controller) {
            return this.game.currentChallenge.attackers.length === 1;
        }
        return this.game.currentChallenge.defenders.length === 1;
    }

    hasParticipatingKnight() {
        let cards = this.controller.filterCardsInPlay(card => {
            return (this.game.currentChallenge.isParticipating(card) &&
                    card.hasTrait('Knight') && 
                    card.getType() === 'character');
        });

        return !!cards.length;
    }

    hasLadyCharacter() {
        let cards = this.controller.filterCardsInPlay(card => {
            return card.hasTrait('Lady') && card.getType() === 'character';
        });

        return !!cards.length;
    }
}

LadySansasRose.code = '02024';

module.exports = LadySansasRose;
