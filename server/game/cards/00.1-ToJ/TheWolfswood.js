import DrawCard from '../../drawcard.js';

class TheWolfswood extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: 1
        });

        this.reaction({
            when: {
                onChallengeInitiated: (event) => event.challenge.attackingPlayer === this.controller
            },
            max: ability.limit.perChallenge(1),
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            handler: () => {
                this.untilEndOfChallenge((ability) => ({
                    match: (card) => card === this.controller.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));

                this.game.addMessage(
                    '{0} uses {1} to raise the claim value on their revealed plot card by 1 until the end of the challenge',
                    this.controller,
                    this
                );
            }
        });
    }
}

TheWolfswood.code = '00243';

export default TheWolfswood;
