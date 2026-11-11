import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AcolyteOfTheFlame extends DrawCard {
    // Acolyte of the Flame (14014)
    // Reaction: After the draw phase begins, kneel Acolyte of the Flame to look at the top 2 cards
    // of an opponent's deck. You may put those cards on the bottom of that player's deck.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'draw'
            },
            cost: ability.costs.kneelSelf(),
            chooseOpponent: (opponent) => opponent.drawDeck.length > 0,
            message: "{player} kneels {source} to look at the top 2 cards of {opponent}'s deck",
            gameAction: GameActions.lookAtDeck((context) => ({
                player: context.player,
                lookingAt: context.opponent,
                amount: 2
            })).then({
                gameAction: GameActions.may({
                    title: 'Place cards on bottom?',
                    message: {
                        format: "Then {player} places the top 2 cards on the bottom of {opponent}'s deck for {source}",
                        args: { opponent: (context) => context.parentContext.opponent }
                    },
                    gameAction: GameActions.simultaneously((context) =>
                        context.parentContext.opponent.drawDeck.slice(0, 2).map((card) =>
                            GameActions.placeCard({
                                card,
                                location: 'draw deck',
                                bottom: true,
                                orderable: false
                            })
                        )
                    )
                })
            })
        });
    }
}

AcolyteOfTheFlame.code = '14014';

export default AcolyteOfTheFlame;
