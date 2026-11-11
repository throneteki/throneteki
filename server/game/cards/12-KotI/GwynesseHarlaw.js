import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GwynesseHarlaw extends DrawCard {
    // Gwynesse Harlaw (12007)
    // Action: Choose 3 cards in an opponent's discard pile and place them on the bottom of his or
    // her deck in any order. Then, gain 1 gold and draw 1 card. (Limit once per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Place cards on bottom',
            limit: ability.limit.perRound(1),
            target: {
                mode: 'exactly',
                numCards: 3,
                activePromptTitle: 'Select cards (last chosen on bottom)',
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.controller !== context.source.controller,
                ordered: true
            },
            message: {
                format: "{player} uses {source} to place {target} on the bottom of {controller}'s deck",
                args: { controller: (context) => context.target.controller }
            },
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) =>
                    GameActions.returnCardToDeck({ card, bottom: true, orderable: false })
                )
            ).then(() => ({
                message: 'Then, {player} draws 1 card and gains 1 gold',
                gameAction: GameActions.simultaneously((context) => [
                    GameActions.drawCards({ player: context.player, amount: 1 }),
                    GameActions.gainGold({ player: context.player, amount: 1 })
                ])
            }))
        });
    }
}

GwynesseHarlaw.code = '12007';

export default GwynesseHarlaw;
