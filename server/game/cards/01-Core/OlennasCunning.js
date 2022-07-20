const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class OlennasCunning extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => ['intrigue', 'power'].includes(event.challenge.challengeType) && event.challenge.winner === this.controller
            },
            message: '{player} plays {source} to have the losing opponent name a cardtype and search their deck',
            gameAction: GameActions.choose({
                player: () => this.game.currentChallenge.loser,
                title: 'Select a card type',
                message: '{choosingPlayer} names the {choice} cardtype',
                choices: {
                    'Character': this.searchGameActionForCardtype('Character'),
                    'Location': this.searchGameActionForCardtype('Location'),
                    'Attachment': this.searchGameActionForCardtype('Attachment'),
                    'Event': this.searchGameActionForCardtype('Event')
                }
            })
        });
    }

    searchGameActionForCardtype(cardType) {
        return GameActions.search({
            title: `Select a non-${cardType}`,
            match: { condition: card => card.getType() !== cardType.toLowerCase() },
            message: '{player} {gameAction}',
            gameAction: GameActions.addToHand(context => ({
                card: context.searchTarget
            }))
        });
    }
}

OlennasCunning.code = '01196';

module.exports = OlennasCunning;
