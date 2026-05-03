import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class KrakensHatchet extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.addTrait('Raider'), ability.effects.modifyStrength(1)]
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.isAttacking(this.parent) &&
                    this.parent.kneeled &&
                    this.parent.allowGameAction('stand')
            },
            cost: ability.costs.choose({
                // TODO BD do not prompt for choosing a character to discard gold from?
                'Discard 1 gold from attached character': ability.costs.discardGoldFromCard(
                    1,
                    (card) => card === this.parent
                ),
                'Pay 2 gold': ability.costs.payGold(2)
            }),
            handler: (context) => {
                this.game.resolveGameAction(GameActions.standCard({ card: this.parent }), context);

                if (context.costs.discardToken) {
                    this.game.addMessage(
                        '{0} uses {1} and discards 1 gold from {2} to stand it',
                        this.controller,
                        this,
                        this.parent
                    );
                } else {
                    this.game.addMessage(
                        '{0} uses {1} and pays 2 gold to stand {2}',
                        this.controller,
                        this,
                        this.parent
                    );
                }
            }
        });
    }
}

KrakensHatchet.code = '00147';

export default KrakensHatchet;
