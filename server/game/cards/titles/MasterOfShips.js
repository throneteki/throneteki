const TitleCard = require('../../TitleCard.js');

class MasterOfShips extends TitleCard {
    setupCardAbilities(ability) {
        this.supports('Master of Whispers');
        this.rivals('Master of Laws', 'Hand of the King');
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'military' &&
                this.game.currentChallenge.attackingPlayer === this.controller &&
                this.controller.isRival(this.game.currentChallenge.defendingPlayer)
            ),
            match: card => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'military' &&
                this.game.currentChallenge.anyParticipants(card => card.controller === this.controller)
            ),
            targetController: 'current',
            effect: ability.effects.contributeChallengeStrength(this, 1)
        });
    }
}

MasterOfShips.code = '01207';

module.exports = MasterOfShips;
