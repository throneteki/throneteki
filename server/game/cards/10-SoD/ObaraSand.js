import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ObaraSand extends DrawCard {
    // Obara Sand (10005)
    // Challenges Action: Return a Sand Snake character to your hand to put a [martell] character
    // with lower printed cost into play from your hand. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character into play',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.returnToHand(
                (card) => card.hasTrait('Sand Snake') && card.getType() === 'character'
            ),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.player &&
                    card.getType() === 'character' &&
                    context.player.canPutIntoPlay(card) &&
                    card.isFaction('martell') &&
                    (!context.costs.returnToHand ||
                        card.getPrintedCost() < context.costs.returnToHand.getPrintedCost())
            },
            message:
                '{player} uses {source} and returns {costs.returnToHand} to their hand to put {target} into play',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

ObaraSand.code = '10005';

export default ObaraSand;
