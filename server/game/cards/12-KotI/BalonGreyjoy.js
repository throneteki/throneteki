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
            message: {
                format: '{player} uses {source} and kneels their faction card to put {target} into play from {targetOwner}\'s discard pile under their control',
                args: {
                    targetOwner: context => context.target.owner
                }
            },
            handler: context => {
                context.player.putIntoPlay(context.target);

                this.atEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.shuffleIntoDeckIfStillInPlay()
                }));
            }
        });
    }
}

BalonGreyjoy.code = '12001';

module.exports = BalonGreyjoy;
