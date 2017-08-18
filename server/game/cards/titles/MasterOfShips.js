const TitleCard = require('../../TitleCard.js');

class MasterOfShips extends TitleCard {
    setupCardAbilities(ability) {
        // TODO: Rivals + Supports
        // TODO: Raise claim for military when attacking a rival
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'military' &&
                this.game.currentChallenge.anyParticipants(card => card.controller === this.controller)
            ),
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.contributeChallengeStrength(1)
        });
    }
}

MasterOfShips.code = '01207';

module.exports = MasterOfShips;
