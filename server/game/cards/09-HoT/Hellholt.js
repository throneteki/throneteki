import DrawCard from '../../drawcard.js';

class Hellholt extends DrawCard {
    // Hellholt (09032)
    // Reaction: After you lose a challenge by 5 or more STR, Hellholt gains 1 power.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller &&
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

Hellholt.code = '09032';

export default Hellholt;
