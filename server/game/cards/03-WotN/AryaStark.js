const DrawCard = require('../../drawcard.js');

class AryaStark extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: (event) =>
                    event.cardStateWhenKilled.controller === this.controller &&
                    event.cardStateWhenKilled.isFaction('stark')
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() <= 3,
                gameAction: 'kill'
            },
            handler: (context) => {
                this.game.killCharacter(context.target);
                this.game.addMessage(
                    '{0} sacrifices {1} to kill {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

AryaStark.code = '03007';

module.exports = AryaStark;
