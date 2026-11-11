import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class ThereIsMyClaim extends DrawCard {
    // There Is My Claim (04024)
    // Play only during a challenge.
    // Challenges Action: Reveal 4 [tyrell] characters from your hand to raise the claim value on
    // your revealed plot card by 1 until the end of the challenge. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Raise claim value by 1',
            max: ability.limit.perChallenge(1),
            phase: 'challenge',
            condition: (context) => context.game.isDuringChallenge(),
            cost: ability.costs.revealCards(
                4,
                (card) =>
                    card.getType() === 'character' &&
                    card.isFaction('tyrell') &&
                    card.location === 'hand'
            ),
            message:
                '{player} plays {source} and reveals {costs.reveal} from their hand to raise their claim value by 1 until the end of the challenge',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: (card) => card === context.player.activePlot,
                effect: ability.effects.modifyClaim(1)
            }))
        });
    }
}

ThereIsMyClaim.code = '04024';

export default ThereIsMyClaim;
