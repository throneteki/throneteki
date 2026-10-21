import DrawCard from '../../drawcard.js';

class TheHoneywine extends DrawCard {
    // The Honeywine (07038)
    // Reaction: After you win a challenge by 5 or more STR as the attacking player, The Honeywine
    // gains 1 power.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    this.allowGameAction('gainPower')
            },
            handler: () => {
                this.modifyPower(1);
                this.game.addMessage('{0} gains 1 power on {1}', this.controller, this);
            }
        });
    }
}

TheHoneywine.code = '07038';

export default TheHoneywine;
