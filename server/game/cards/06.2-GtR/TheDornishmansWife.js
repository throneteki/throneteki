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
                let bonusMessage = [];

                if(this.opponentHasMorePower(context.opponent)) {
                    this.game.addGold(this.controller, 2);
                    bonusMessage.push('gain 2 gold');
                }

                if(this.opponentHasMoreCardsInHand(context.opponent)) {
                    this.game.addPower(this.controller, 1);
                    bonusMessage.push('gain 1 power for their faction');
                }

                if(this.opponentControlsMoreCharacters(context.opponent)) {
                    this.controller.drawCardsToHand(1);
                    bonusMessage.push('draw 1 card');
                }

                this.game.addMessage('{0} uses {1} to choose {2} and {3}',
                    this.controller, this, context.opponent, bonusMessage);
            }
        });
    }

    opponentHasMorePower(opponent) {
        return opponent.getTotalPower() > this.controller.getTotalPower();
    }

    opponentHasMoreCardsInHand(opponent) {
        return opponent.hand.size() > this.controller.hand.size();
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
