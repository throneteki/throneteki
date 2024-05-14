import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class WheelsWithinWheels extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message:
                '{player} uses {source} to search the top 10 cards of their deck for any number of events',
            gameAction: GameActions.search({
                title: 'Select any number of events',
                match: { type: 'event' },
                topCards: 10,
                numToSelect: 10,
                //TODO: When a SelectCards GameAction is implemented, update the below to reveal action (reveal=false on search), and select while revealed
                gameAction: GameActions.choose({
                    title: 'Select event to draw',
                    message: {
                        format: '{choosingPlayer} adds {choice} to their hand, and places {notChosen} in their discard pile',
                        args: {
                            notChosen: (context) =>
                                context.searchTarget.filter(
                                    (card) => card !== context.selectedChoice.card
                                )
                        }
                    },
                    choices: (context) => this.buildChoices(context.searchTarget)
                })
            })
        });
    }

    buildChoices(targets) {
        return targets.reduce((choices, target) => {
            choices[target.name] = choices[target.name] || {
                card: target,
                gameAction: GameActions.simultaneously([
                    GameActions.addToHand({ card: target }),
                    ...targets
                        .filter((card) => card !== target)
                        .map((card) =>
                            GameActions.placeCard({ card: card, location: 'discard pile' })
                        )
                ])
            };
            return choices;
        }, {});
    }
}

WheelsWithinWheels.code = '06100';

export default WheelsWithinWheels;
