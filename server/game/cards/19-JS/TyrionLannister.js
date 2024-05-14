const DrawCard = require('../../drawcard.js');

class TyrionLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put Mercenary into play',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardGold(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Mercenary') &&
                    context.player.canPutIntoPlay(card)
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target);

                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.moveToBottomOfDeckIfStillInPlay(true)
                }));

                this.game.addMessage(
                    "{0} discards 1 gold from {1} to put {2} into play from {3}'s discard pile under their control",
                    context.player,
                    this,
                    context.target,
                    context.target.owner
                );
            }
        });
    }
}

TyrionLannister.code = '19014';

module.exports = TyrionLannister;
