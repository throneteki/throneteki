import DrawCard from '../../drawcard.js';

class UnexpectedGuile extends DrawCard {
    // Unexpected Guile (17139)
    // Character with shadow you control only. Shadow (0).
    // Attached character gets +2 STR.
    // Reaction: After you win a challenge in which attached character is participating, return it
    // to shadows.
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

export default UnexpectedGuile;
