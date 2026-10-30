import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheRedViper extends DrawCard {
    // The Red Viper (01109)
    // Reaction: After you win a challenge in which The Red Viper is participating as an attacker,
    // he gains 1 power for every 5 STR by which you won the challenge.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.isAttacking(context.source) &&
                    event.challenge.strengthDifference >= 5
            },
            message: {
                format: '{player} uses {source} to have {source} gain {amount} power',
                args: { amount: (context) => viperPower(context) }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.source,
                amount: viperPower(context)
            }))
        });
    }
}

function viperPower(context) {
    return Math.trunc(context.event.challenge.strengthDifference / 5);
}

TheRedViper.code = '01109';

export default TheRedViper;
