import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheHoneywine extends DrawCard {
    // The Honeywine (07038)
    // Reaction: After you win a challenge by 5 or more STR as the attacking player, The Honeywine
    // gains 1 power.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.attackingPlayer === context.source.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    context.source.allowGameAction('gainPower')
            },
            message: '{player} gains 1 power on {source}',
            gameAction: GameActions.gainPower((context) => ({ card: context.source, amount: 1 }))
        });
    }
}

TheHoneywine.code = '07038';

export default TheHoneywine;
