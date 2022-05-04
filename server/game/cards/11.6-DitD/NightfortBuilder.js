const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class NightfortBuilder extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardKneeled: event => event.card === this
            },
            message: '{player} uses {source} to reveal the top card of their deck',
            gameAction: GameActions.revealTopCards(context => ({
                player: context.player
            })).then({
                message: '{player} {gameAction}',
                gameAction: GameActions.ifCondition({
                    condition: context => context.event.cards[0].isMatch({
                        faction: 'thenightswatch',
                        type: ['attachment', 'location']
                    }),
                    thenAction: GameActions.drawCards(context => ({
                        player: context.player,
                        amount: 1
                    }))
                })
            })
        });
    }
}

NightfortBuilder.code = '11105';

module.exports = NightfortBuilder;
