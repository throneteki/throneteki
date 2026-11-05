import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class Sunspear extends DrawCard {
    // Sunspear (22012)
    // During the challenges phase, you may spend gold on Sunspear as if it were in your gold pool.
    // Reaction: After a [martell] card enters play under your control, Sunspear gains 1 gold. (2
    // gold instead if that card is a Lord or Lady character.) (Limit once per phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.game.currentPhase === 'challenge',
            match: (card, context) => card === context.source,
            effect: ability.effects.canSpendGold(
                (spendParams, context) => spendParams.activePlayer === context.source.controller
            )
        });

        const amountGained = (context) => {
            return context.event.card.hasTrait('Lord') || context.event.card.hasTrait('Lady')
                ? 2
                : 1;
        };

        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.isFaction('martell') && event.card.controller === context.player
            },
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} uses {source} to place {amountGained} gold from the treasury on {source}',
                args: { amountGained: (context) => amountGained(context) }
            },
            gameAction: GameActions.placeToken((context) => ({
                card: context.source,
                token: Tokens.gold,
                amount: amountGained(context)
            }))
        });
    }
}

Sunspear.code = '22012';

export default Sunspear;
