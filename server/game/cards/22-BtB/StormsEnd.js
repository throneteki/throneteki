import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class StormsEnd extends DrawCard {
    // Storm's End (22003)
    // During the challenges phase, characters without a [power] icon cannot stand.
    // Reaction: After a [military] or [intrigue] challenge is initiated by or against you, kneel
    // Storm's End to change the challenge type to [power].
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.game.currentPhase === 'challenge',
            match: (card) => card.getType() === 'character' && !card.hasIcon('power'),
            targetController: 'any',
            effect: ability.effects.cannotBeStood()
        });
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    ['military', 'intrigue'].includes(event.challenge.initiatedChallengeType) &&
                    [
                        event.challenge.initiatingPlayer,
                        event.challenge.initiatedAgainstPlayer
                    ].includes(context.player)
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to {gameAction}',
            gameAction: GameActions.changeChallengeType((context) => ({
                challenge: context.event.challenge,
                challengeType: 'power'
            }))
        });
    }
}

StormsEnd.code = '22003';

export default StormsEnd;
