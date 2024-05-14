const DrawCard = require('../../drawcard.js');

class UnexpectedGuile extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current', shadow: true });
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.isParticipating(this.parent)
            },
            handler: (context) => {
                context.player.moveCard(this.parent, 'shadows');

                this.game.addMessage(
                    '{0} uses {1} to return {2} to shadows',
                    this.controller,
                    this,
                    this.parent
                );
            }
        });
    }
}

UnexpectedGuile.code = '17139';

module.exports = UnexpectedGuile;
