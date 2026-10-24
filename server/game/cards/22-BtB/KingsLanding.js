import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class KingsLanding extends DrawCard {
    // King's Landing (22026)
    // Reaction: After a King's Landing location enters play, kneel it to draw 1 card. (Limit twice
    // per round.)
    // Marshaling Action: Kneel a King's Landing location to gain 1 gold. (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain 1 gold',
            phase: 'marshal',
            limit: ability.limit.perPhase(2),
            cost: ability.costs.kneel(
                (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.source.controller &&
                    card.getType() === 'location' &&
                    card.hasTrait("King's Landing")
            ),
            message: {
                format: '{player} uses {source} and kneels {kneeled} to gain 1 gold',
                args: { kneeled: (context) => context.costs.kneel }
            },
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 1 }))
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.controller === context.source.controller &&
                    event.card.getType() === 'location' &&
                    event.card.hasTrait("King's Landing")
            },
            limit: ability.limit.perRound(2),
            cost: ability.costs.kneelSpecific((context) => context.event.card),
            message: {
                format: '{player} uses {source} and kneels {kneeled} to draw 1 card',
                args: { kneeled: (context) => context.costs.kneel }
            },
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

KingsLanding.code = '22026';

export default KingsLanding;
