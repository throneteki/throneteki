const DrawCard = require('../../drawcard.js');

class SerOsmundKettleblack extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put Knight into play',
            limit: ability.limit.perPhase(1),
            phase: 'challenge',
            cost: ability.costs.discardGold(),
            target: {
                cardCondition: (card) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    card.hasTrait('Knight') &&
                    this.controller.canPutIntoPlay(card)
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target);

                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.discardIfStillInPlay(false)
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

SerOsmundKettleblack.code = '06069';

module.exports = SerOsmundKettleblack;
