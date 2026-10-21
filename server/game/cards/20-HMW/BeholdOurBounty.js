import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class BeholdOurBounty extends DrawCard {
    // Behold our Bounty (20038)
    // Reaction: After you win a challenge, return an attacking Small Council or Spy character to
    // your hand to raise the claim value on your revealed plot card by 1 until the end of the
    // challenge.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller
            },
            cost: ability.costs.returnToHand((card, context) =>
                context.source.isAttackingSpyCouncil(card)
            ),
            message:
                '{player} uses {source} to return {costs.returnToHand} to their hand to raise their claim by 1',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: (card) => card === context.player.activePlot,
                effect: ability.effects.modifyClaim(1)
            }))
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
