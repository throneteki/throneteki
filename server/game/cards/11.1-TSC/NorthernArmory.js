const DrawCard = require('../../drawcard');

class NorthernArmory extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeStood()
        });
        this.action({
            title: 'Stand a character',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isFaction('stark'),
                gameAction: 'stand'
            },
            handler: (context) => {
                this.controller.standCard(context.target);
                this.game.addMessage(
                    '{0} kneels {1} to stand {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

NorthernArmory.code = '11003';

module.exports = NorthernArmory;
