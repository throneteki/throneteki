const DrawCard = require('../../drawcard.js');

class LongMayHeReign extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'King' });
        this.whileAttached({
            effect: ability.effects.cannotBeKilled()
        });
        this.forcedReaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller &&
                    event.challenge.challengeType === 'power' &&
                    event.challenge.defendingPlayer === this.controller
            },
            handler: () => {
                this.game.addMessage(
                    '{0} is forced by {1} to sacrifice {1}',
                    this.controller,
                    this
                );
                this.controller.sacrificeCard(this);
            }
        });
    }
}

LongMayHeReign.code = '13108';

module.exports = LongMayHeReign;
