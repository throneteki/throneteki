import DrawCard from '../../drawcard.js';

class BeholdOurBounty extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) => event.challenge.winner === this.controller
            },
            cost: ability.costs.returnToHand(
                (card) => card.getType() === 'character' && card.isAttacking()
            ),
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: (card) => card === context.player.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));
                this.game.addMessage(
                    '{0} uses {1} and returns {2} to their hand to raise their claim by 1',
                    context.player,
                    this,
                    context.costs.returnToHand
                );
            }
        });
    }
}

BeholdOurBounty.code = '00291';

export default BeholdOurBounty;
