import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class JonArryn extends DrawCard {
    // Jon Arryn (23001)
    // Insight. Renown.
    // Jon Arryn cannot be saved.
    // Forced Interrupt: When Jon Arryn is killed, each player may either: draw 2 cards, or gain 1
    // power for their faction.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeSaved()
        });

        this.forcedInterrupt({
            when: {
                onCharacterKilled: (event, context) => event.card === context.source
            },
            message:
                '{player} is forced by {source} to allow each player to either draw 2 cards or gain 1 power for their faction',
            gameAction: GameActions.simultaneously((context) =>
                context.game.getPlayersInFirstPlayerOrder().map((player) =>
                    GameActions.choose({
                        player: () => player,
                        choices: {
                            'Draw 2 cards': {
                                message: '{choosingPlayer} chooses to draw 2 cards',
                                gameAction: GameActions.drawCards((context) => ({
                                    player: context.choosingPlayer,
                                    amount: 2,
                                    source: context.source
                                }))
                            },
                            'Gain 1 power': {
                                message:
                                    '{choosingPlayer} chooses to gain 1 power for their faction',
                                gameAction: GameActions.gainPower((context) => ({
                                    card: context.choosingPlayer.faction,
                                    amount: 1
                                }))
                            }
                        },
                        cancelMessage:
                            '{player} chooses to not draw 2 cards or gain 1 power for their faction'
                    })
                )
            )
        });
    }
}

JonArryn.code = '23001';

export default JonArryn;
