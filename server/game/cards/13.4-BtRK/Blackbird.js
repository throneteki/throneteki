const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Blackbird extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card !== this &&
                    card.getType() === 'location' &&
                    card.isFaction('thenightswatch'),
                gameAction: 'stand'
            },
            message: '{player} uses {source} to stand {target}',
            handler: (context) => {
                this.game.resolveGameAction(GameActions.standCard({ card: context.target }));
            }
        });
    }
}

Blackbird.code = '13066';

module.exports = Blackbird;
