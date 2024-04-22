const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class TheDornishmansWife extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain gold/power/card',
            chooseOpponent: opponent => (
                this.opponentHasMorePower(opponent) ||
                this.opponentHasMoreCardsInHand(opponent) ||
                this.opponentControlsMoreCharacters(opponent)
            ),
            handler: context => {
                let gameActions = [];
                
                if(this.opponentHasMorePower(context.opponent)) {
                    gameActions.push(GameActions.gainGold(context => ({ player: context.player, amount: 1 })));
                }

                if(this.opponentHasMoreCardsInHand(context.opponent)) {
                    gameActions.push(GameActions.gainPower(context => ({ card: context.player.faction, amount: 1 })));
                }

                if(this.opponentControlsMoreCharacters(context.opponent)) {
                    gameActions.push(GameActions.drawCards(context => ({ player: context.player, amount: 1 })));
                }

                const action = GameActions.simultaneously(gameActions);

                this.game.addMessage('{0} plays {1} to {gameAction}',
                    this.controller, this, context.opponent, action.message(context));

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
        let ownChars = this.controller.filterCardsInPlay(card => {
            return card.getType() === 'character';
        });

        let oppChars = opponent.filterCardsInPlay(card => {
            return card.getType() === 'character';
        });

        return oppChars.length > ownChars.length;
    }
}

TheDornishmansWife.code = '06039';

module.exports = TheDornishmansWife;
