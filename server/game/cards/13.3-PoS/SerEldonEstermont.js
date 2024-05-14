const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class SerEldonEstermont extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand location',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'location' &&
                    card.isFaction('baratheon') &&
                    card.kneeled,
                gameAction: 'stand'
            },
            message: '{player} uses {source} to stand {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.standCard((context) => ({ card: context.target })),
                    context
                );
            },
            limit: ability.limit.perRound(1)
        });
    }
}

SerEldonEstermont.code = '13047';

module.exports = SerEldonEstermont;
