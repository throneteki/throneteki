const DrawCard = require('../../drawcard.js');

class BalonGreyjoy extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put card into play',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: card => card.location === 'discard pile' && card.controller !== this.controller &&
                                       this.controller.canPutIntoPlay(card)
            },
            handler: context => {
                context.player.putIntoPlay(context.target);

                this.atEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.shuffleIntoDeckIfStillInPlay()
                }));

                this.game.addMessage('{0} uses {1} and kneels their faction card to put {2} into play from {3}\'s discard pile under their control',
                    context.player, this, context.target, context.target.owner);
            }
        });
    }
}

BalonGreyjoy.code = '12001';

module.exports = BalonGreyjoy;
