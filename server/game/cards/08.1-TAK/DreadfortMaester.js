import DrawCard from '../../drawcard.js';

class DreadfortMaester extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event) =>
                    event.challenge.attackingPlayer === this.controller &&
                    ['military', 'intrigue'].includes(event.challenge.initiatedChallengeType)
            },
            cost: ability.costs.sacrificeSelf(),
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    targetController: 'any', //here any is necessary in case dreadfort maester changes it´s controller to a player other than the owner
                    match: (card) => card === context.player.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));

                this.game.addMessage(
                    '{0} sacrifices {1} to raise the claim value on their revealed plot card by 1 until the end of the challenge',
                    context.player,
                    this
                );
            }
        });
    }
}

DreadfortMaester.code = '08002';

export default DreadfortMaester;
