import DrawCard from '../../drawcard.js';

class EagerOpportunist extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character into play',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardGold(),
            target: {
                cardCondition: (card, context) =>
                    card.controller === context.player &&
                    card.location === 'hand' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 4 &&
                    context.player.canPutIntoPlay(card)
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target);

                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.discardIfStillInPlay(true)
                }));

                this.game.addMessage(
                    '{0} discards 1 gold from {1} to put {2} into play from their hand',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

EagerOpportunist.code = '00167';

export default EagerOpportunist;
