const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class TheThroneOfDorne extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: event => event.winner && this.controller !== event.winner
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: { location: 'play area', faction: 'martell', controller: 'current', condition: card => GameActions.placeCard({ card, location: 'shadows' }).allow() }
            },
            message: '{player} kneels {costs.kneel} to place {target} in shadows',
            handler: context => {
                context.game.resolveGameAction(GameActions.placeCard(context => ({ card: context.target, location: 'shadows' })), context);
            }
        });
    }
}

TheThroneOfDorne.code = '25543';
TheThroneOfDorne.version = '1.0';

module.exports = TheThroneOfDorne;
