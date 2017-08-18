const TitleCard = require('../../TitleCard.js');

class HandOfTheKing extends TitleCard {
    setupCardAbilities(ability) {
        // TODO: Rivals + Supports
        // TODO: Additional power challenge against different opponent
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'power' &&
                this.game.currentChallenge.anyParticipants(card => card.controller === this.controller)
            ),
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.contributeChallengeStrength(1)
        });
    }
}

HandOfTheKing.code = '01208';

module.exports = HandOfTheKing;
