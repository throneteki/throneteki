import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
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
            condition: (context) => context.source.hasToken(Tokens.gold),
            phase: 'plot',
            cost: [ability.costs.kneelParent(), ability.costs.sacrificeSelf()],
            message: {
                format: "{player} kneels {parent} and sacrifices {source} to discard {gold} power from each opponent's faction card",
                args: {
                    parent: (context) => context.cardStateWhenInitiated.parent,
                    gold: (context) => context.cardStateWhenInitiated.tokens.gold
                }
            },
            gameAction: GameActions.simultaneously((context) =>
                context.game.getOpponents(context.player).map((player) =>
                    GameActions.discardPower({
                        card: player.faction,
                        amount: context.cardStateWhenInitiated.tokens.gold
                    })
                )
            )
        });
    }
}

KingsBlood.code = '06108';

export default KingsBlood;
