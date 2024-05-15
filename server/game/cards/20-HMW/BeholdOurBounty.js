import DrawCard from '../../drawcard.js';

class BeholdOurBounty extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) => event.challenge.winner === this.controller
            },
            cost: ability.costs.returnToHand((card) => this.isAttackingSpyCouncil(card)),
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: (card) => card === context.player.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));
                this.game.addMessage(
                    '{0} uses {1} to return {2} to their hand to raise their claim by 1',
                    context.player,
                    this,
                    context.costs.returnToHand
                );
            }
        });
    }

    isAttackingSpyCouncil(card) {
        return (
            card.getType() === 'character' &&
            (card.hasTrait('Spy') || card.hasTrait('Small Council')) &&
            card.isAttacking()
        );
    }
}

BeholdOurBounty.code = '20038';

export default BeholdOurBounty;
