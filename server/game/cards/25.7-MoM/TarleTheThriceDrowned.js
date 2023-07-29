const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class TarleTheThriceDrowned extends DrawCard {
    setupCardAbilities(ability) {
        this.forcedReaction({
            when: {
                onCardEntersPlay: event => (
                    event.card.getType() === 'character' &&
                    event.card.controller === this.controller &&
                    event.card.isFaction('greyjoy') &&
                    event.originalLocation === 'dead pile'
                )
            },
            limit: ability.limit.perRound(2),
            gameAction: GameActions.simultaneously(context =>
                context.game.getPlayersInFirstPlayerOrder().map(player => 
                    GameActions.ifCondition({
                        condition: () => player.faction.kneeled,
                        thenAction: GameActions.discardPower({ card: player.faction, amount: 1 }),
                        elseAction: GameActions.choose({
                            player: () => player,
                            choices: {
                                'Discard Power': {
                                    message: '{choosingPlayer} chooses to discard 1 power from their faction card',
                                    gameAction: GameActions.discardPower({ card: player.faction, amount: 1 })
                                },
                                'Kneel Faction Card': {
                                    message: '{choosingPlayer} chooses to kneel their faction card',
                                    gameAction: GameActions.kneelCard({ card: player.faction })
                                }
                            }
                        })
                    })
                )
            )
        });
    }
}

TarleTheThriceDrowned.code = '25514';
TarleTheThriceDrowned.version = '1.0';

module.exports = TarleTheThriceDrowned;
