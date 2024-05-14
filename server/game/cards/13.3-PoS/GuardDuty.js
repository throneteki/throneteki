import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GuardDuty extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'thenightswatch' });
        this.reaction({
            when: {
                onDeclaredAsDefender: (event) =>
                    this.parent &&
                    event.card === this.parent &&
                    this.parent.kneeled &&
                    this.parent.allowGameAction('stand')
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} uses {source} to stand {parent}',
                args: { parent: () => this.parent }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.standCard(() => ({ card: this.parent })),
                    context
                );
            }
        });
    }
}

GuardDuty.code = '13046';

export default GuardDuty;
