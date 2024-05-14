const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class LynCorbray extends DrawCard {
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

module.exports = LynCorbray;
