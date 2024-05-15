import DrawCard from '../../drawcard.js';

class BurningOnTheSand extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller && event.challenge.isUnopposed()
            },
            handler: (context) => {
                let opponent = context.event.challenge.winner;
                this.untilEndOfChallenge((ability) => ({
                    match: (card) => card === card.controller.activePlot,
                    targetController: opponent,
                    effect: ability.effects.setClaim(0)
                }));

                this.game.addMessage(
                    "{0} plays {1} to set the claim value on {2}'s revealed plot card to 0 until the end of the challenge",
                    this.controller,
                    this,
                    opponent
                );
            }
        });
    }
}

BurningOnTheSand.code = '04076';

export default BurningOnTheSand;
