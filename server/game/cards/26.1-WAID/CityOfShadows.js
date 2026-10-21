import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class CityOfShadows extends PlotCard {
    // City of Shadows (26019)
    // When Revealed: Choose a card you control with shadow and return it to your hand. (You may
    // return it to shadows instead if there is a City plot card in your used pile.)
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                cardCondition: {
                    location: 'play area',
                    controller: 'current',
                    condition: (card, context) =>
                        card.isShadow() &&
                        (GameActions.returnCardToHand({ card }).allow() ||
                            (this.hasUsedCityPlot(context.player) &&
                                GameActions.putIntoShadows({ card }).allow()))
                }
            },
            message: {
                format: '{player} uses {source} to return {target} to {locations}',
                args: {
                    locations: (context) =>
                        this.hasUsedCityPlot(context.player) ? 'hand or shadows' : 'hand'
                }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.ifCondition({
                        condition: (context) => !this.hasUsedCityPlot(context.player),
                        thenAction: {
                            message: '{player} {gameAction}',
                            gameAction: GameActions.returnCardToHand((context) => ({
                                card: context.target
                            }))
                        },
                        elseAction: GameActions.choose({
                            title: 'Hand or shadows?',
                            message: '{player} {gameAction}',
                            choices: {
                                'Return to hand': GameActions.returnCardToHand((context) => ({
                                    card: context.target
                                })),
                                'Place in shadows': GameActions.putIntoShadows((context) => ({
                                    card: context.target
                                }))
                            }
                        })
                    }),
                    context
                );
            }
        });
    }

    hasUsedCityPlot(player) {
        return player.getNumberOfUsedPlotsByTrait('City') > 0;
    }
}

CityOfShadows.code = '26019';

export default CityOfShadows;
