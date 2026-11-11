import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheonGreyjoy extends DrawCard {
    // Theon Greyjoy (01071)
    // Stealth.
    // Reaction: After you win an unopposed challenge in which Theon Greyjoy is participating, he
    // gains 1 power.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    event.challenge.isUnopposed() &&
                    context.source.allowGameAction('gainPower')
            },
            message: '{player} gains 1 power on {source} after winning an unopposed challenge',
            gameAction: GameActions.gainPower((context) => ({ card: context.source, amount: 1 }))
        });
    }
}

TheonGreyjoy.code = '01071';

export default TheonGreyjoy;
