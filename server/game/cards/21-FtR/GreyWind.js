const DrawCard = require('../../drawcard.js');

class GreyWind extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark', unique: true });
        this.whileAttached({
            effect: ability.effects.addKeyword('stealth')
        });
        this.interrupt({
            canCancel: true,
            when: {
                //Restrict triggering on own character abilities to forced triggered abilities
                onCardAbilityInitiated: (event, context) => event.source.getType() === 'character' && event.ability.isTriggeredAbility() &&
                                                            (event.ability.isForcedAbility() || event.source.controller !== context.player)
            },
            cost: ability.costs.returnToHand(card => card.hasTrait('Direwolf')),
            limit: ability.limit.perPhase(1),
            handler: context => {
                context.event.cancel();
                this.game.addMessage('{0} uses {1} and returns {2} to their hand to cancel {3}', context.player, this, context.costs.returnToHand, context.event.source);
            }
        });
        this.action({
            title: 'Attach Greywind to another character',
            cost: ability.costs.payGold(1),
            target: {
                type: 'select',
                cardCondition: (card, context) => context.player.canAttach(this, card) && card.location === 'play area' && card !== this.parent
            },
            limit: ability.limit.perPhase(1),
            handler: context => {
                context.player.attach(context.player, this, context.target);
                this.game.addMessage('{0} pays 1 gold to attach {1} to {2}', context.player, this, context.target);
            }
        });
    }
}

GreyWind.code = '21018';

module.exports = GreyWind;
