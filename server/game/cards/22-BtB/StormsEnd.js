import DrawCard from '../../drawcard.js';

class StormsEnd extends DrawCard {
    // Storm's End (22003)
    // During the challenges phase, characters without a [power] icon cannot stand.
    // Reaction: After a [military] or [intrigue] challenge is initiated by or against you, kneel
    // Storm's End to change the challenge type to [power].
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

export default StormsEnd;
