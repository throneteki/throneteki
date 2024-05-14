import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AcolyteOfTheFlame extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'draw'
            },
            cost: ability.costs.kneelSelf(),
            chooseOpponent: (opponent) => opponent.drawDeck.length > 0,
            message: "{player} kneels {source} to look at the top 2 cards of {opponent}'s deck",
            handler: (context) => {
                this.game
                    .resolveGameAction(
                        GameActions.lookAtDeck((context) => ({
                            player: context.player,
                            lookingAt: context.opponent,
                            amount: 2
                        })),
                        context
                    )
                    .thenExecute(() => {
                        this.context = context;
                        this.game.promptWithMenu(context.player, this, {
                            activePrompt: {
                                menuTitle: 'Place cards on bottom?',
                                buttons: [
                                    { text: 'Yes', method: 'choosePlaceOnBottom', arg: 'yes' },
                                    { text: 'No', method: 'choosePlaceOnBottom', arg: 'no' }
                                ]
                            },
                            source: this
                        });
                    });
            }
        });
    }

    choosePlaceOnBottom(player, arg) {
        if (arg !== 'yes') {
            return true;
        }

        let topCards = this.context.opponent.drawDeck.slice(0, 2);
        this.game.addMessage(
            "Then {0} places the top 2 cards on the bottom of {1}'s deck for {2}",
            this.context.player,
            this.context.opponent,
            this
        );
        this.game.resolveGameAction(
            GameActions.simultaneously(
                topCards.map((card) =>
                    GameActions.placeCard({
                        card,
                        location: 'draw deck',
                        bottom: true,
                        orderable: false
                    })
                )
            )
        );

        return true;
    }
}

AcolyteOfTheFlame.code = '14014';

export default AcolyteOfTheFlame;
