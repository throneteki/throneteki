import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GuardDuty extends DrawCard {
    // Guard Duty (13046)
    // [thenightswatch] character only.
    // Reaction: After attached character is declared as a defender, kneel Guard Duty to stand
    // attached character.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'thenightswatch' });
        this.reaction({
            when: {
                onDeclaredAsDefender: (event, context) =>
                    context.source.parent &&
                    event.card === context.source.parent &&
                    context.source.parent.kneeled &&
                    context.source.parent.allowGameAction('stand')
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} uses {source} to stand {parent}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.standCard((context) => ({ card: context.source.parent }))
        });
    }
}

GuardDuty.code = '13046';

export default GuardDuty;
