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
                condition: context => context.event.revealed.length > 0,
                gameAction: GameActions.may({
                    title: context => `Put ${context.event.revealed[0].name} into play?`,
                    message: {
                        format: '{player} puts {revealed} into play and returns {source} to the top of their deck',
                        args: { revealed: context => context.event.revealed[0] }
                    },
                    gameAction: GameActions.putIntoPlay(context => ({
                        player: context.player,
                        card: context.event.revealed[0],
                        dupeIsValid: true
                    })).then({
                        gameAction: GameActions.returnCardToDeck(context => ({
                            allowSave: false,
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
