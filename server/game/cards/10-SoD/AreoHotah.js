import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AreoHotah extends DrawCard {
    // Areo Hotah (10006)
    // Ambush (6).
    // Reduce the cost to ambush Areo Hotah by 1 for each plot in your used pile.
    // Reaction: After you win a challenge in which Areo Hotah is defending, return him to your hand
    // to raise the claim value on your revealed plot by 1 until the end of the phase.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('ambush', () =>
                this.controller.getNumberOfUsedPlots()
            )
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.controller === event.challenge.winner &&
                    context.source.isDefending()
            },
            cost: ability.costs.returnSelfToHand(),
            message:
                '{player} returns {source} to their hand to raise the claim value on their revealed plot card by 1 until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: (card) => card === context.player.activePlot,
                effect: ability.effects.modifyClaim(1)
            }))
        });
    }
}

AreoHotah.code = '10006';

export default AreoHotah;
