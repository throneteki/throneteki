import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerGarlanTyrell extends DrawCard {
    // Ser Garlan Tyrell (09003)
    // Action: During a challenge in which a Knight character you control is attacking alone,
    // discard 1 card from your hand to raise the claim value on your revealed plot card by 1 until
    // the end of the challenge. (Limit once per challenge.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Raise claim',
            limit: ability.limit.perChallenge(1),
            condition: (context) =>
                context.game.currentChallenge &&
                context.game.currentChallenge.attackingPlayer === context.source.controller &&
                context.game.currentChallenge.attackers.length === 1 &&
                context.source.hasParticipatingKnight(),
            cost: ability.costs.discardFromHand(),
            message:
                '{player} uses {source} and discards {costs.discardFromHand} from their hand to raise the claim value on their revealed plot card by 1 until the end of the challenge',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: (card) => card === context.player.activePlot,
                effect: ability.effects.modifyClaim(1)
            }))
        });
    }

    hasParticipatingKnight() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.isParticipating() && card.hasTrait('Knight') && card.getType() === 'character'
        );
    }
}

SerGarlanTyrell.code = '09003';

export default SerGarlanTyrell;
