const DrawCard = require('../../drawcard.js');

class StormsEnd extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentPhase === 'challenge',
            match: (card) => card.getType() === 'character' && !card.hasIcon('power'),
            targetController: 'any',
            effect: ability.effects.cannotBeStood()
        });
        this.reaction({
            when: {
                onChallengeInitiated: (event) =>
                    ['military', 'intrigue'].includes(event.challenge.initiatedChallengeType) &&
                    [
                        event.challenge.initiatingPlayer,
                        event.challenge.initiatedAgainstPlayer
                    ].includes(this.controller)
            },
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                let currentChallengeType = context.event.challenge.challengeType;
                let changingChallengeType = 'power';
                this.game.addMessage(
                    '{0} kneels {1} to change the challenge type from {2} to {3}',
                    this.controller,
                    this,
                    currentChallengeType,
                    changingChallengeType
                );
                context.event.challenge.challengeType = changingChallengeType;
            }
        });
    }
}

StormsEnd.code = '22003';

module.exports = StormsEnd;
