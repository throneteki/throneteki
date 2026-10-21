import DrawCard from '../../drawcard.js';

class TheRedViper extends DrawCard {
    // The Red Viper (01109)
    // Reaction: After you win a challenge in which The Red Viper is participating as an attacker,
    // he gains 1 power for every 5 STR by which you won the challenge.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.isAttacking() &&
                    event.challenge.strengthDifference >= 5 &&
                    this.allowGameAction('gainPower')
            },
            handler: () => {
                let power = Math.trunc(this.game.currentChallenge.strengthDifference / 5);
                this.modifyPower(power);

                this.game.addMessage('{0} gains {1} power on {2}', this.controller, power, this);
            }
        });
    }
}

TheRedViper.code = '01109';

export default TheRedViper;
