import AgendaCard from '../../agendacard.js';
import GameActions from '../../GameActions/index.js';

class TradingWithBraavos extends AgendaCard {
    // Trading With Braavos (26080)
    // Your deck may include non-loyal Warship locations from any faction. Your deck cannot include
    // more than 1 copy of each non-limited location.
    // Reaction: After claim is applied for a challenge you won, kneel your faction card to search
    // the top 10 cards of your deck for a non-limited location, reveal it, and add it to your hand
    // (you may place it in shadows instead if it has the Warship trait). Shuffle your deck.
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
