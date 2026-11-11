import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class DreadfortMaester extends DrawCard {
    // Dreadfort Maester (08002)
    // Reaction: After you initiate a [military] or [intrigue] challenge, sacrifice Dreadfort
    // Maester to raise the claim value on your revealed plot card by 1 until the end of the
    // challenge.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.attackingPlayer === context.source.controller &&
                    ['military', 'intrigue'].includes(event.challenge.initiatedChallengeType)
            },
            cost: ability.costs.sacrificeSelf(),
            message:
                '{player} sacrifices {source} to raise the claim value on their revealed plot card by 1 until the end of the challenge',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                targetController: 'any', //here any is necessary in case dreadfort maester changes it´s controller to a player other than the owner
                match: (card) => card === context.player.activePlot,
                effect: ability.effects.modifyClaim(1)
            }))
        });
    }
}

DreadfortMaester.code = '08002';

export default DreadfortMaester;
