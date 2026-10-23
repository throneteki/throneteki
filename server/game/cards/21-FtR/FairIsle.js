import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FairIsle extends DrawCard {
    // Fair Isle (21009)
    // Challenges Action: Kneel Fair Isle to choose an opponent. That player chooses 2 cards in
    // their hand, if able, and places them on top of their deck in any order. At the end of the
    // phase, that player draws 2 cards.
    // +1 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Place cards on top of deck',
            phase: 'challenge',
            chooseOpponent: true,
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} uses {source} to have {opponent} place 2 cards on top of their deck',
                args: { opponent: (context) => context.opponent }
            },
            gameAction: GameActions.simultaneously([
                GameActions.chooseCards({
                    player: (context) => context.opponent,
                    mode: 'exactly',
                    numCards: 2,
                    title: 'Select 2 cards',
                    cardCondition: (card, context) =>
                        card.location === 'hand' && card.controller === context.choosingPlayer,
                    gameAction: (card, context) =>
                        GameActions.placeCard({
                            card,
                            player: context.choosingPlayer,
                            location: 'draw deck'
                        })
                }),
                GameActions.delayedEffect({
                    duration: 'untilEndOfRound',
                    when: {
                        onAtEndOfPhase: () => true
                    },
                    message: {
                        format: 'Then {opponent} draws 2 cards for {source}',
                        args: { opponent: (context) => context.opponent }
                    },
                    gameAction: GameActions.drawCards((context) => ({
                        player: context.opponent,
                        amount: 2
                    }))
                })
            ])
        });
    }
}

FairIsle.code = '21009';

export default FairIsle;
