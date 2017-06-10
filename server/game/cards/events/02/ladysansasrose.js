const DrawCard = require('../../../drawcard.js');

class LadySansasRose extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    this.hasSingleParticipatingChar(challenge) &&
                    this.hasParticipatingKnight(challenge))
            },
            max: ability.limit.perChallenge(1),
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

    hasSingleParticipatingChar(challenge) {
        if(challenge.attackingPlayer === this.controller) {
            return challenge.attackers.length === 1;
        }
        return challenge.defenders.length === 1;
    }

    hasParticipatingKnight(challenge) {
        let cards = this.controller.filterCardsInPlay(card => {
            return (challenge.isParticipating(card) &&
                    card.hasTrait('Knight') && 
                    card.getType() === 'character');
        });

        return !!cards.length;
    }

    hasLadyCharacter() {
        return this.controller.anyCardsInPlay(card => card.hasTrait('Lady') && card.getType() === 'character');
    }
}

LadySansasRose.code = '02024';

module.exports = LadySansasRose;
