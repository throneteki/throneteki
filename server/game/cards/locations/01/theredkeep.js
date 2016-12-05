const DrawCard = require('../../../drawcard.js');

class TheRedKeep extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onAttackersDeclared', 'onEndChallengePhase']);
    }

    onAttackersDeclared(event, attackingPlayer, challengeType) {
        if(!this.inPlay || this.owner !== attackingPlayer) {
            return;
        }

        if(challengeType === 'power' && attackingPlayer.cardsInChallenge.size() > 0) {
            event.strengthModifier += 2;

            this.game.addMessage('{0} uses {1} to add 2 to the strength of this {2} challenge', attackingPlayer, this, challengeType);
        }
    }

    onEndChallengePhase() {
        if(!this.inPlay || this.kneeled) {
            return;
        }

        if(this.owner.getNumberOfChallengesLost('power') === 0) {
            this.game.promptWithMenu(this.owner, this, {
                activePrompt: {
                    menuTitle: 'Kneel ' + this.name + '?',
                    buttons: [
                        { text: 'Yes', command: 'menuButton', method: 'drawTwo' },
                        { text: 'No', command: 'menuButton', method: 'cancel' }
                    ]
                },
                waitingPromptTitle: 'Waiting for opponent to use ' + this.name
            });

            this.game.pipeline.continue();            
        }
    }

    drawTwo(player) {
        if(!this.inPlay || this.isBlank() || this.owner !== player) {
            return false;
        }

        this.game.addMessage('{0} kneels {1} to draw 2 cards', player, this);
        
        player.drawCardsToHand(2);

        return true;
    }

    cancel(player) {
        if(!this.inPlay || this.isBlank() || this.owner !== player) {
            return false;
        }

        this.game.addMessage('{0} declines to trigger {1}', player, this);
        return true;
    }    
}

TheRedKeep.code = '01061';

module.exports = TheRedKeep;
