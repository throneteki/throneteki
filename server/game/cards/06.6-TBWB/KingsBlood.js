import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';

class KingsBlood extends DrawCard {
    // King's Blood (06108)
    // Bastard or King character you control only. Bestow (3).
    // Plot Action: Kneel attached character and sacrifice King's Blood to discard X power from each
    // opponent's faction card. X is the number of gold King's Blood has.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: ['Bastard', 'King'], controller: 'current' });
        this.action({
            title: "Discard power from opponent's faction",
            condition: () => this.hasToken(Tokens.gold),
            phase: 'plot',
            cost: [ability.costs.kneelParent(), ability.costs.sacrificeSelf()],
            handler: (context) => {
                let gold = context.cardStateWhenInitiated.tokens.gold;

                for (let player of this.game.getOpponents(context.player)) {
                    this.game.addPower(player, -gold);
                }

                this.game.addMessage(
                    "{0} kneels {1} and sacrifices {2} to discard {3} power from each opponent's faction card",
                    context.player,
                    context.cardStateWhenInitiated.parent,
                    this,
                    gold
                );
            }
        });
    }
}

KingsBlood.code = '06108';

export default KingsBlood;
