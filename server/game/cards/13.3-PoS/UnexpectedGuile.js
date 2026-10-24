import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class UnexpectedGuile extends DrawCard {
    // Unexpected Guile (13044)
    // Character with shadow you control only. Shadow (1).
    // Attached character gets +2 STR and gains insight.
    // Forced Interrupt: When a challenge ends in which attached character is participating, return
    // Unexpected Guile and attached character to shadows.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'current', shadow: true });
        this.whileAttached({
            effect: [ability.effects.modifyStrength(2), ability.effects.addKeyword('Insight')]
        });

        this.forcedInterrupt({
            when: {
                onChallengeFinished: (event, context) =>
                    event.challenge.getParticipants().includes(context.source.parent)
            },
            message: {
                format: '{player} is forced to return {source} and {parent} to shadows',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.simultaneously([
                GameActions.putIntoShadows((context) => ({
                    card: context.source.parent,
                    allowSave: true
                })),
                GameActions.putIntoShadows((context) => ({ card: context.source }))
            ])
        });
    }
}

UnexpectedGuile.code = '13044';

export default UnexpectedGuile;
