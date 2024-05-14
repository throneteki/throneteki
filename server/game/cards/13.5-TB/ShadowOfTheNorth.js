import DrawCard from '../../drawcard.js';

class ShadowOfTheNorth extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Raise claim by 1',
            max: ability.limit.perChallenge(1),
            condition: () => this.game.isDuringChallenge(),
            handler: () => {
                this.untilEndOfChallenge((ability) => ({
                    match: (card) => card === this.controller.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));

                this.game.addMessage(
                    '{0} plays {1} to raise the claim value on their revealed plot card by 1 until the end of the challenge',
                    this.controller,
                    this
                );

                if (
                    this.game
                        .getPlayers()
                        .some((player) => player.activePlot && player.activePlot.hasTrait('Winter'))
                ) {
                    this.game.addMessage(
                        '{0} uses {1} to return {1} to their hand instead of their discard pile',
                        this.controller,
                        this
                    );
                    this.controller.moveCard(this, 'hand');
                }
            }
        });
    }
}

ShadowOfTheNorth.code = '13082';

export default ShadowOfTheNorth;
