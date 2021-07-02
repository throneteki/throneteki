const DrawCard = require('../../drawcard');
const {Tokens} = require('../../Constants');

class DarkandFullofTerrors extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Place character in shadows',
            condition: () => this.controller.anyCardsInPlay(card => card.hasTrait('R\'hllor') && card.getType() === 'character'),
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.getStrength() <= 3 && card.kneeled
            },
            handler: context => {
                this.game.addMessage('{0} plays {1} to put {2} into shadow', context.player, this, context.target);
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

DarkandFullofTerrors.code = '20003';

module.exports = DarkandFullofTerrors;
