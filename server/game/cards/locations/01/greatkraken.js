const DrawCard = require('../../../drawcard.js');

class GreatKraken extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onUnopposedWin', 'onBeginRound', 'onCardPlayed']);
    }

    onBeginRound() {
        this.abilityUsed = 0;
    }

    onUnopposedWin(event, challenge) {
        var winner = challenge.winner;
        if(!this.inPlay || this.isBlank() || this.controller !== winner && this.abilityUsed < 2) {
            return;
        }

        this.game.promptWithMenu(winner, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Draw 1 card', command: 'menuButton', method: 'drawCard' },
                    { text: 'Gain 1 power', command: 'menuButton', method: 'gainPower' },
                    { text: 'No', command: 'menuButton', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to perform reactions'
        });
    }

    onCardPlayed(event, player, card) {
        if(!this.inPlay || this.controller !== player) {
            return;
        }

        if(card.name === 'Balon Greyjoy') {
            card.addKeyword('stealth');
        }
    }

    gainPower(player) {
        if(!this.inPlay || this.isBlank() || this.controller !== player) {
            return false;
        }

        this.game.addPower(player, 1);

        this.game.addMessage('{0} uses {1} to 1 power for their faction', player, this);

        this.abilityUsed++;

        return true;
    }

    drawCard(player) {
        if(!this.inPlay || this.isBlank() || this.controller !== player) {
            return false;
        }

        player.drawCardsToHand(1);

        this.game.addMessage('{0} uses {1} to draw 1 card', player, this);

        this.abilityUsed++;

        return true;
    }

    cancel(player) {
        if(!this.inPlay || this.isBlank() || this.controller !== player) {
            return false;
        }

        this.game.addMessage('{0} declines to trigger {1}', player, this);
        return true;
    }

    leavesPlay() {
        super.leavesPlay();
        
        var balonGreyjoy = this.controller.findCardByName(this.controller.cardsInPlay, 'Balon Greyjoy');

        if(balonGreyjoy) {
            balonGreyjoy.removeKeyword('stealth');
        }
    }
}

GreatKraken.code = '01078';

module.exports = GreatKraken;
