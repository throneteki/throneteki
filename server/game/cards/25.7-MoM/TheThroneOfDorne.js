const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class TheThroneOfDorne extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            reserve: 1
        });
        this.reaction({
            when: {
                onDominanceDetermined: event => event.winner && this.controller !== event.winner
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: { location: 'play area', faction: 'martell', controller: 'current', condition: card => GameActions.putIntoShadows({ card }).allow() }
            },
            message: '{player} kneels {costs.kneel} to place {target} in shadows',
            handler: context => {
                context.game.resolveGameAction(GameActions.putIntoShadows(context => ({ card: context.target })), context);
            }
        });
    }
}

TheThroneOfDorne.code = '25543';
TheThroneOfDorne.version = '1.1';

module.exports = TheThroneOfDorne;
