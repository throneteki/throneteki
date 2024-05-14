import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TheDornishmansWife extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain gold/power/card',
            chooseOpponent: (opponent) =>
                this.opponentHasMorePower(opponent) ||
                this.opponentHasMoreCardsInHand(opponent) ||
                this.opponentControlsMoreCharacters(opponent),
            handler: (context) => {
                const action = GameActions.simultaneously((context) => [
                    ...(this.opponentHasMorePower(context.opponent)
                        ? [
                              GameActions.gainGold((context) => ({
                                  player: context.player,
                                  amount: 2
                              }))
                          ]
                        : []),
                    ...(this.opponentHasMoreCardsInHand(context.opponent)
                        ? [
                              GameActions.gainPower((context) => ({
                                  card: context.player.faction,
                                  amount: 1
                              }))
                          ]
                        : []),
                    ...(this.opponentControlsMoreCharacters(context.opponent)
                        ? [
                              GameActions.drawCards((context) => ({
                                  player: context.player,
                                  amount: 1
                              }))
                          ]
                        : [])
                ]);

                this.game.addMessage(
                    '{0} plays {1} and {2}',
                    context.player,
                    context.source,
                    action.message(context)
                );

                this.game.resolveGameAction(action, context);
            }
        });
    }

    opponentHasMorePower(opponent) {
        return opponent.getTotalPower() > this.controller.getTotalPower();
    }

    opponentHasMoreCardsInHand(opponent) {
        return opponent.hand.length > this.controller.hand.length;
    }

    opponentControlsMoreCharacters(opponent) {
        let ownChars = this.controller.filterCardsInPlay((card) => {
            return card.getType() === 'character';
        });

        let oppChars = opponent.filterCardsInPlay((card) => {
            return card.getType() === 'character';
        });

        return oppChars.length > ownChars.length;
    }
}

TheDornishmansWife.code = '06039';

export default TheDornishmansWife;
