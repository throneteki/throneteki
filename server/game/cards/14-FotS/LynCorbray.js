import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LynCorbray extends DrawCard {
    // Lyn Corbray (14039)
    // Stealth.
    // Reaction: After an opponent initiates a [power] challenge against you, stand Lyn Corbray.
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: (event) =>
                    event.challenge.isMatch({
                        initiatedAgainstPlayer: this.controller,
                        initiatedChallengeType: 'power'
                    }) && this.allowGameAction('stand')
            },
            message: '{player} uses {source} to stand {source}',
            handler: (context) => {
                this.game.resolveGameAction(GameActions.standCard({ card: this }), context);
            }
        });
    }
}

LynCorbray.code = '14039';

export default LynCorbray;
