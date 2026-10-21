import DrawCard from '../../drawcard.js';

class TheonGreyjoy extends DrawCard {
    // Theon Greyjoy (01071)
    // Stealth.
    // Reaction: After you win an unopposed challenge in which Theon Greyjoy is participating, he
    // gains 1 power.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.isParticipating() &&
                    event.challenge.isUnopposed() &&
                    this.allowGameAction('gainPower')
            },
            handler: () => {
                this.modifyPower(1);
                this.game.addMessage(
                    '{0} gains 1 power on {1} after winning an unopposed challenge',
                    this.controller,
                    this
                );
            }
        });
    }
}

TheonGreyjoy.code = '01071';

export default TheonGreyjoy;
