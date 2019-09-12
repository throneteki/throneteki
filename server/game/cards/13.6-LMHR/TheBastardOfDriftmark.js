const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class TheBastardOfDriftmark extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.isParticipating() && event.challenge.challengeType === 'intrigue'
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: card => card.location === 'play area' && card.getType() === 'location' && card.kneeled,
                gameAction: 'stand'
            },
            message: '{player} uses {source} to stand {target}',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.standCard(context => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

TheBastardOfDriftmark.code = '13109';

module.exports = TheBastardOfDriftmark;
