import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Queenscrown extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: "Reveal top 3 cards of opponent's deck",
            cost: ability.costs.kneelSelf(),
            chooseOpponent: true,
            message: "{player} kneels {costs.kneel} to reveal the top 3 cards of {opponent}'s deck",
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.revealTopCards((context) => ({
                        player: context.opponent,
                        amount: 3,
                        whileRevealed: GameActions.genericHandler((context) => {
                            const isCharacter = (card) => card.getType() === 'character';
                            if (context.revealed.some(isCharacter)) {
                                this.game.promptForSelect(context.player, {
                                    activePromptTitle: 'Select a character',
                                    cardCondition: (card) =>
                                        context.revealed.includes(card) && isCharacter(card),
                                    onSelect: (player, card) => {
                                        context.target = card;
                                        this.handleCards(context);
                                        return true;
                                    },
                                    onCancel: () => {
                                        this.handleCards(context);
                                        return true;
                                    }
                                });
                            } else {
                                this.handleCards(context);
                                return true;
                            }
                        })
                    })),
                    context
                );
            }
        });
    }

    handleCards(context) {
        if (context.target) {
            this.game.addMessage(
                "{0} places {1} in {2}'s discard pile",
                context.player,
                context.target,
                context.opponent
            );
        }
        const placedOnBottom = context.revealed.filter((card) => card !== context.target);
        if (placedOnBottom.length > 0) {
            this.game.addMessage(
                "{0} places {1} on the bottom of {2}'s deck, in any order",
                context.player,
                placedOnBottom,
                context.opponent
            );
        }
        this.game.resolveGameAction(
            GameActions.simultaneously((context) =>
                context.revealed.map((card) =>
                    card === context.target
                        ? GameActions.placeCard({
                              card,
                              location: 'discard pile',
                              player: context.player
                          })
                        : GameActions.placeCard({
                              card,
                              location: 'draw deck',
                              bottom: true,
                              player: context.player
                          })
                )
            ),
            context
        );
    }
}

Queenscrown.code = '07019';

export default Queenscrown;
