import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MercenaryContract extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addTrait('Mercenary')
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.isAttacking(this.parent) &&
                    this.parent.kneeled &&
                    this.parent.allowGameAction('stand')
            },
            cost: [ability.costs.payGold(1), ability.costs.kneelSelf()],
            message: {
                format: '{player} kneels {source} and pays 1 gold to stand {parent}',
                args: {
                    parent: (context) => context.source.parent
                }
            },
            handler: (context) => {
                this.game.resolveGameAction(GameActions.standCard({ card: this.parent }), context);
            }
        });
    }
}

MercenaryContract.code = '13114';

export default MercenaryContract;
