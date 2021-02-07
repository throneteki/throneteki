const DrawCard = require('../../drawcard.js');

class TyrionLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put Mercenary into play',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardGold(),
            target: {
                cardCondition: card => card.location === 'discard pile' && card.getType() === 'character' && card.hasTrait('Mercenary') && this.controller.canPutIntoPlay(card)
            },
            handler: context => {
                context.player.putIntoPlay(context.target);

                this.atEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.moveToBottomOfDeckIfStillInPlay(true)
                }));

                this.game.addMessage('{0} discards 1 gold from {1} to put {2} into play from {3}\'s discard pile under their control', context.player, this, context.target, context.target.owner);
            }
        });
    }
}

TyrionLannister.code = '19014';

module.exports = TyrionLannister;
