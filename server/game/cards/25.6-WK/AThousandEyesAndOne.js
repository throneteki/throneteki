import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class AThousandEyesAndOne extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Look at an opponent hand or shadows',
            cost: ability.costs.kneelFactionCard(),
            chooseOpponent: true,
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.choose({
                        title: (context) =>
                            `Look at ${context.opponent.name}'s hand or shadows area?`,
                        choices: {
                            Hand: {
                                message: "{player} chooses to look at {opponent}'s hand",
                                gameAction: GameActions.simultaneously([
                                    GameActions.lookAtHand((context) => ({
                                        player: context.player,
                                        opponent: context.opponent,
                                        context
                                    })),
                                    GameActions.drawCards({ player: context.player, amount: 1 })
                                ])
                            },
                            Shadows: {
                                message: "{player} chooses to look at {opponent}'s shadows area",
                                gameAction: GameActions.simultaneously([
                                    GameActions.lookAtShadows((context) => ({
                                        player: context.player,
                                        opponent: context.opponent,
                                        context
                                    })),
                                    GameActions.drawCards({ player: context.player, amount: 1 })
                                ])
                            }
                        }
                    }),
                    context
                );
            }
        });
    }
}

AThousandEyesAndOne.code = '25118';

export default AThousandEyesAndOne;
