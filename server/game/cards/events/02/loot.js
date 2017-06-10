const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class Loot extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    this.controller === challenge.winner
                    && challenge.isUnopposed()
                    && this.opponentHasGold()
                    && this.opponentHasDrawDeck())
            },
            handler: () => {
                let opponent = this.game.getOtherPlayer(this.controller);

                if(!opponent) {
                    return false;
                }

                let maxDiscard = Math.min(opponent.gold, opponent.drawDeck.size());
                let buttons = _.map(_.range(1, maxDiscard + 1), num => {
                    return { text: num, method: 'numberSelected', arg: num };
                });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select # of cards to discard',
                        buttons: buttons
                    },
                    source: this
                }); 
            }
        });
    }

    numberSelected(player, num) {
        let opponent = this.game.getOtherPlayer(this.controller);

        opponent.discardFromDraw(num);
        this.game.addGold(opponent, -num);

        this.game.addMessage('{0} uses {1} to discard the top {2} cards from {3}\'s deck',
            this.controller, this, num, opponent);

        return true;
    }

    opponentHasGold() {
        let opponent = this.game.getOtherPlayer(this.controller);

        if(!opponent) {
            return false;
        }

        return opponent.gold >= 1;
    }

    opponentHasDrawDeck() {
        let opponent = this.game.getOtherPlayer(this.controller);

        if(!opponent) {
            return false;
        }

        return opponent.drawDeck.size() >= 1;
    }
}

Loot.code = '02073';

module.exports = Loot;
