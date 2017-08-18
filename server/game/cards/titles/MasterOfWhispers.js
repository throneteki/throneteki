const TitleCard = require('../../TitleCard.js');

class MasterOfWhispers extends TitleCard {
    setupCardAbilities(ability) {
        // TODO: Rivals + Supports
        // TODO: Resolve intrigue claim against any number of opponents
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'intrigue' &&
                this.game.currentChallenge.anyParticipants(card => card.controller === this.controller)
            ),
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.contributeChallengeStrength(1)
        });
    }
}

MasterOfWhispers.code = '01206';

module.exports = MasterOfWhispers;
