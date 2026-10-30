import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BeaconOfTheSouth extends DrawCard {
    // Beacon of the South (10038)
    // [tyrell] character only.
    // Reaction: After you win a challenge by 5 or more STR in which attached character is
    // attacking, it gains 1 power.
    setupCardAbilities() {
        this.attachmentRestriction({ faction: 'tyrell' });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    event.challenge.isAttacking(context.source.parent) &&
                    context.source.parent.allowGameAction('gainPower')
            },
            message: {
                format: '{player} uses {source} to gain 1 power on {parent}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.source.parent,
                amount: 1
            }))
        });
    }
}

BeaconOfTheSouth.code = '10038';

export default BeaconOfTheSouth;
