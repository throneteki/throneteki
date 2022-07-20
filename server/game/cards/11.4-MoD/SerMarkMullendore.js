const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class SerMarkMullendore extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && event.challenge.isParticipating(this)
            },
            message: '{player} uses {source} to reveal the top card of their deck',
            gameAction: GameActions.revealTopCards(context => ({
                player: context.player
            })).then({
                gameAction: GameActions.may({
                    title: context => `Put ${context.event.cards[0].name} into play?`,
                    message: {
                        format: '{player} puts {topCard} into play',
                        args: { topCard: context => context.event.cards[0] }
                    },
                    gameAction: GameActions.putIntoPlay(context => ({
                        player: context.player,
                        card: context.event.cards[0]
                    })).then({
                        message: '{player} returns {source} to the top of their deck',
                        gameAction: GameActions.returnCardToDeck(context => ({
                            card: context.source
                        }))
                    })
                })
            })
        });
    }
}

SerMarkMullendore.code = '11063';

module.exports = SerMarkMullendore;
