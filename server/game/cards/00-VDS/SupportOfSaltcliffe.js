import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SupportOfSaltcliffe extends DrawCard {
    // Support of Saltcliffe (00010)
    // [greyjoy] character only.
    // Attached character gains stealth.
    // Reaction: After you win an unopposed challenge in which attached character is attacking,
    // stand attached character.
    // Draft format only.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'greyjoy' });

        this.whileAttached({
            effect: ability.effects.addKeyword('stealth')
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.controller === event.challenge.winner &&
                    event.challenge.isParticipating(context.source.parent) &&
                    event.challenge.isUnopposed()
            },
            message: {
                format: '{player} uses {source} to stand {parent}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.standCard((context) => ({ card: context.source.parent }))
        });
    }
}

SupportOfSaltcliffe.code = '00010';

export default SupportOfSaltcliffe;
