import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.isParticipating(context.source.parent)
            },
            message: {
                format: '{player} uses {source} to return {parent} to shadows',
                args: { parent: (context) => context.cardStateWhenInitiated.parent }
            },
            gameAction: GameActions.putIntoShadows((context) => ({ card: context.source.parent }))
        });
    }
}

UnexpectedGuile.code = '17139';

export default UnexpectedGuile;
