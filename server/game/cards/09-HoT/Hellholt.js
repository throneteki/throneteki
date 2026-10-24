import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Hellholt extends DrawCard {
    // Hellholt (09032)
    // Reaction: After you lose a challenge by 5 or more STR, Hellholt gains 1 power.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    context.source.allowGameAction('gainPower')
            },
            message: '{player} gains 1 power on {source}',
            gameAction: GameActions.gainPower((context) => ({ card: context.source, amount: 1 }))
        });
    }
}

Hellholt.code = '09032';

export default Hellholt;
