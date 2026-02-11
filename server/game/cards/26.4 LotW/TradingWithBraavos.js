import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class TradingWithBraavos extends AgendaCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onClaimApplied: (event) => event.challenge && event.player === this.controller
            },
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} uses {source} to search the top 10 cards of their deck for a non-limited location',
            gameAction: GameActions.search({
                topCards: 10,
                title: 'Select a location',
                match: { type: 'location', limited: false },
                gameAction: GameActions.ifCondition({
                    condition: (context) => !context.searchTarget.hasTrait('Warship'),
                    thenAction: {
                        message: '{player} {gameAction}',
                        gameAction: GameActions.addToHand((context) => ({
                            card: context.searchTarget
                        }))
                    },
                    elseAction: GameActions.choose({
                        title: 'Put card in shadows?',
                        message: '{player} {gameAction}',
                        choices: {
                            'Add to hand': GameActions.addToHand((context) => ({
                                card: context.searchTarget
                            })),
                            'Put in shadows': GameActions.placeCard((context) => ({
                                card: context.searchTarget,
                                location: 'shadows'
                            }))
                        }
                    })
                })
            })
        });
    }
}

TradingWithBraavos.code = '26080';

export default TradingWithBraavos;
