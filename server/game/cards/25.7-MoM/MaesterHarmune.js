const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class MaesterHarmune extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onGoldTransferred: event => event.source.getGameElementType() === 'player' && event.source !== this.controller && event.target === this.controller
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards(context => ({ player: context.player, amount: 1, source: this }))
                .then({
                    message: {
                        format: 'Then, {player} and {other} each place a card from their hand on top of their deck',
                        args: { other: context => context.parentContext.event.source }
                    },
                    target: {
                        activePromptTitle: 'Select a card',
                        choosingPlayer: (player, context) => player === context.player || player === context.parentContext.event.source,
                        cardCondition: { location: 'hand', controller: 'choosingPlayer', condition: card => GameActions.placeCard({ card, location: 'draw deck', bottom: false }).allow() }
                    },
                    handler: context => {
                        context.game.resolveGameAction(GameActions.simultaneously(context => 
                            context.targets.getTargets().map(card => 
                                GameActions.placeCard({ card, location: 'draw deck', bottom: false })
                            )
                        ), context);
                    }
                })
        });
    }
}

MaesterHarmune.code = '25550';
MaesterHarmune.version = '1.0';

module.exports = MaesterHarmune;
