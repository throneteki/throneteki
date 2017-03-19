const FulfillMilitaryClaim = require('../../../gamesteps/challenge/fulfillmilitaryclaim.js');

const DrawCard = require('../../../drawcard.js');

class MaesterAemon extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPhaseEnded: (event, phase) => phase === 'challenge' && this.notAllChallengesInitiatedAgainstYou()
            },
            handler: () => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);
                var buttons = [];

                if(otherPlayer.getNumberOfChallengesInitiatedByType('military') === 0) {
                    buttons.push({ text: 'Military', method: 'satisfyMilClaim' });
                }
                if(otherPlayer.getNumberOfChallengesInitiatedByType('intrigue') === 0) {
                    buttons.push({ text: 'Intrigue', method: 'satisfyIntClaim' });
                }
                if(otherPlayer.getNumberOfChallengesInitiatedByType('power') === 0) {
                    buttons.push({ text: 'Power', method: 'satisfyPowClaim' });
                }
                buttons.push({ text: 'Done', method: 'cancel' });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a challenge type',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    satisfyMilClaim(player) {
        var otherPlayer = this.game.getOtherPlayer(this.controller);
        var claim = player.getClaim();
        var type = 'military';

        this.game.addMessage('{0} uses {1} to have {2} satisfy {3} claim. {2} must kill {4} character{5}', 
                              player, this, otherPlayer, type, claim, claim > 1 ? 's' : '');

        this.game.queueStep(new FulfillMilitaryClaim(this.game, otherPlayer, claim));

        return true;
    }

    satisfyIntClaim(player) {
        var otherPlayer = this.game.getOtherPlayer(this.controller);
        var claim = player.getClaim();
        var type = 'intrigue';

        this.game.addMessage('{0} uses {1} to have {2} satisfy {3} claim. {2} must discard {4} card{5} at random', 
                              player, this, otherPlayer, type, claim, claim > 1 ? 's' : '');

        otherPlayer.discardAtRandom(claim);

        return true;
    }

    satisfyPowClaim(player) {
        var otherPlayer = this.game.getOtherPlayer(this.controller);
        var claim = player.getClaim();
        var type = 'power';

        this.game.addMessage('{0} uses {1} to have {2} satisfy {3} claim. {2} removes {4} power and {0} gains {4} power', 
                              player, this, otherPlayer, type, claim);

        this.game.transferPower(player, otherPlayer, claim);

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);

        return true;
    }

    notAllChallengesInitiatedAgainstYou() {
        var otherPlayer = this.game.getOtherPlayer(this.controller);

        if(!otherPlayer) {
            return false;
        }

        if(otherPlayer.getNumberOfChallengesInitiatedByType('military') === 0 ||
           otherPlayer.getNumberOfChallengesInitiatedByType('intrigue') === 0 ||
           otherPlayer.getNumberOfChallengesInitiatedByType('power') === 0) {
            return true;
        }

        return false;
    }
}

MaesterAemon.code = '07005';

module.exports = MaesterAemon;
