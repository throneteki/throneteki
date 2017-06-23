const DrawCard = require('../../../drawcard.js');

class SerOsmundKettleblack extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put Knight into play',
            phase: 'challenge',
            cost: ability.costs.discardGold(),
            target: {
                activePromptTitle: 'Select a Knight',
                cardCondition: card => card.location === 'hand' && card.controller === this.controller && 
                                       card.getType() === 'character' && card.hasTrait('Knight')
            },
            handler: context => {
                context.player.putIntoPlay(context.target);

                this.atEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.discardIfStillInPlay(false)
                }));

                this.game.addMessage('{0} discards 1 gold from {1} to put {2} into play from their hand', context.player, this, context.target);
            }
        });
    }
}

SerOsmundKettleblack.code = '06069';

module.exports = SerOsmundKettleblack;
