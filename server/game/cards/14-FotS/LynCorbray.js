import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LynCorbray extends DrawCard {
    // Lyn Corbray (14039)
    // Stealth.
    // Reaction: After an opponent initiates a [power] challenge against you, stand Lyn Corbray.
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.isMatch({
                        initiatedAgainstPlayer: context.source.controller,
                        initiatedChallengeType: 'power'
                    }) && context.source.allowGameAction('stand')
            },
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard((context) => ({ card: context.source }))
        });
    }
}

LynCorbray.code = '14039';

export default LynCorbray;
