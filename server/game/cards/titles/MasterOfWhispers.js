const TitleCard = require('../../TitleCard.js');

class MasterOfWhispers extends TitleCard {
    setupCardAbilities(ability) {
        this.supports('Hand of the King');
        this.rivals('Master of Laws', 'Master of Coin');
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.applyClaimToMultipleOpponents('intrigue')
        });
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'intrigue' &&
                this.game.currentChallenge.anyParticipants(card => card.controller === this.controller)
            ),
            targetController: 'current',
            effect: ability.effects.contributeStrength(this, 1)
        });
    }
}

MasterOfWhispers.code = '01206';

module.exports = MasterOfWhispers;
