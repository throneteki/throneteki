import DrawCard from '../../drawcard.js';

class ObaraSand extends DrawCard {
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
            handler: (context) => {
                context.player.putIntoPlay(context.target);
                this.game.addMessage(
                    '{0} uses {1} and returns {2} to their hand to put {3} into play',
                    context.player,
                    this,
                    context.costs.returnToHand,
                    context.target
                );
            }
        });
    }
}

ObaraSand.code = '10005';

export default ObaraSand;
