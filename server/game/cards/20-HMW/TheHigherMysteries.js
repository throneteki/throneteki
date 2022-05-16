const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class TheHigherMysteries extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.hasParticipatingMaester()
            },
            message: '{player} plays {source} to reveal the top card of their deck',
            gameAction: GameActions.revealTopCards(context => ({
                player: context.player
            })).then({
                message: {
                    format: '{player} puts {topCard} into play',
                    args: { topCard: context => context.event.cards[0] }
                },
                gameAction: GameActions.putIntoPlay(context => ({
                    player: context.player,
                    card: context.event.cards[0]
                }))
            })
        });
    }

    hasParticipatingMaester() {
        return this.controller.anyCardsInPlay(card => card.hasTrait('Maester') &&
                                                      card.isParticipating() &&
                                                      card.getType() === 'character');
    }
}

TheHigherMysteries.code = '20048';

module.exports = TheHigherMysteries;
