const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class HighGround extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand character',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: {
                    location: 'play area',
                    trait: 'Army',
                    type: 'character',
                    kneeled: true
                },
                gameAction: 'stand'
            },
            message: '{player} kneels {source} to stand {target}',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.standCard((context) => ({
                        card: context.target
                    })),
                    context
                );
            }
        });
    }
}

HighGround.code = '16019';

module.exports = HighGround;
