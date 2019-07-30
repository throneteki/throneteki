const DrawCard = require('../../drawcard');
const {Tokens} = require('../../Constants');

class TyrionLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: event => event.card.controller === this.controller 
                                          && event.card.getType() !== 'event'
            },
            limit: ability.limit.perRound(1),
            target: {
                cardCondition: card => card.location === 'play area'
                                    && card.controller === this.controller
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to put {2} into shadow', context.player, this, context.target);
                context.player.putIntoShadows(context.target, false, () => {
                    context.target.modifyToken(Tokens.shadow, 1);
                    
                    this.lastingEffect(ability => ({
                        condition: () => context.target.location === 'shadows',
                        targetLocation: 'any',
                        match: context.target,
                        effect: ability.effects.addKeyword(`Shadow (${context.target.getPrintedCost()})`)
                    }));
                });
            }
        });
    }
}

TyrionLannister.code = '13089';

module.exports = TyrionLannister;
