const DrawCard = require('../../drawcard.js');

class DolorousEdd extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Add as a defender',
            location: 'hand',
            condition: () =>
                this.game.isDuringChallenge({
                    challengeType: 'intrigue',
                    defendingPlayer: this.controller
                }) && this.controller.canPutIntoPlay(this),
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                this.game.addMessage(
                    '{0} kneels their faction card to put {1} into play as a defender',
                    this.controller,
                    this
                );
                this.controller.putIntoPlay(this, 'play', { kneeled: true });
                this.game.currentChallenge.addDefender(this);
                this.game.once('afterChallenge', (event) => this.promptOnWin(event.challenge));
            }
        });
    }

    promptOnWin(challenge) {
        if (challenge.winner !== this.controller || this.location !== 'play area') {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Return ' + this.name + ' to your hand?',
                buttons: [
                    { text: 'Yes', method: 'returnToHand' },
                    { text: 'No', method: 'cancelReturnToHand' }
                ]
            }
        });
    }

    returnToHand() {
        this.game.addMessage(
            '{0} chooses to return {1} to their hand after winning the challenge',
            this.controller,
            this
        );
        this.controller.returnCardToHand(this, false);
        return true;
    }

    cancelReturnToHand() {
        this.game.addMessage('{0} declines to return {1} to their hand', this.controller, this);
        return true;
    }
}

DolorousEdd.code = '04025';

module.exports = DolorousEdd;
