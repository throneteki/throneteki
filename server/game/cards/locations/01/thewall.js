const DrawCard = require('../../../drawcard.js');

class TheWall extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed', 'onEndChallengePhase']);
    }

    play(player) {
        super.play(player);

        player.cardsInPlay.each(card => {
            if(card.getFaction() === this.getFaction() && card.getType() === 'character') {
                card.strengthModifier++;
            }
        });
    }

    onCardPlayed(e, player, cardId) {
        if(!this.inPlay || this.owner !== player) {
            return;
        }

        var card = player.findCardInPlayByUuid(cardId);
        if(!card) {
            return;
        }

        if(card.getFaction() === this.getFaction() && card.getType() === 'character') {
            card.strengthModifier++;
        }
    }

    onUnopposedWin(winner) {
        if(this.owner !== winner && !this.kneeled) {
            this.game.addMessage('{0} is forced to kneel {1} because they lost an unopposed challenge', this.owner, this);
            this.kneeled = true;
        }
    }

    onEndChallengePhase() {
        if(!this.inPlay || this.kneeled) {
            return;
        }

        this.game.promptWithMenu(this.owner, this, {
            activePrompt: {
                menuTitle: 'Kneel ' + this.name + '?',
                buttons: [
                    { text: 'Yes', command: 'menuButton', method: 'kneel' },
                    { text: 'No', command: 'menuButton', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });

        this.game.pipeline.continue();            
    }

    kneel(player) {
        if(!this.inPlay || this.isBlank() || this.owner !== player) {
            return false;
        }

        this.game.addMessage('{0} kneels {1} to gain 2 power for their faction', player, this);
        
        this.game.addPower(player, 2);

        return true;
    }

    cancel(player) {
        if(!this.inPlay || this.isBlank() || this.owner !== player) {
            return false;
        }

        this.game.addMessage('{0} declines to trigger {1}', player, this);
        return true;
    }    

    leavesPlay() {
        super.leavesPlay();

        this.owner.cardsInPlay.each(card => {
            if(card.getFaction() === this.getFaction() && card.getType() === 'character') {
                card.strengthModifier--;
            }
        });
    }
}

TheWall.code = '01137';

module.exports = TheWall;
