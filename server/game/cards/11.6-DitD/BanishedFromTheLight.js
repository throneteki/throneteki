const DrawCard = require('../../drawcard');

class BanishedFromTheLight extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.isMatch({ challengeType: 'power', winner: this.controller })
            },
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character'
            },
            handler: context => {
                this.game.addMessage('{0} plays {1} to put {2} into shadow', context.player, this, context.target);
                context.player.putIntoShadows(context.target, true, () => {
                    context.target.modifyToken('shadow', 1);

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

BanishedFromTheLight.code = '11108';

module.exports = BanishedFromTheLight;
