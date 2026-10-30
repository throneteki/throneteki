import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Heartsbane extends DrawCard {
    // Heartsbane (01191)
    // [tyrell] character only.
    // Action: While attached character is participating in a challenge, kneel Heartsbane to give
    // that character +3 STR until the end of the challenge.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'tyrell' });
        this.action({
            title: 'Give attached character +3 STR',
            condition: (context) =>
                context.source.parent && context.source.parent.isParticipating(),
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to give {parent} +3 STR until the end of the challenge',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.source.parent,
                effect: ability.effects.modifyStrength(3)
            }))
        });
    }
}

Heartsbane.code = '01191';

export default Heartsbane;
