const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class MaesterHarmune extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onGoldTransferred: event => event.source.getGameElementType() === 'player' && event.source !== this.controller && event.target === this.controller
            },
            limit: ability.limit.perRound(2),
            message: {
                format: '{player} uses {source} to reveal the top card of {opponent}\'s deck',
                args: { opponent: context => context.event.source }
            },
            gameAction: GameActions.revealTopCards(context => ({
                player: context.event.source
            })).then({
                message: '{player} {gameAction}',
                gameAction: GameActions.ifCondition({
                    condition: context => context.event.cards[0].getType() === 'character',
                    thenAction: GameActions.simultaneously([
                        GameActions.discardCard(context => ({
                            card: context.event.revealed[0]
                        })),
                        GameActions.drawCards(context => ({
                            player: context.player,
                            amount: 1,
                            source: this
                        }))
                    ])
                })
            })
        });
    }
}

MaesterHarmune.code = '25550';
MaesterHarmune.version = '1.1';

module.exports = MaesterHarmune;
