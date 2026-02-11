import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GwynesseHarlaw extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Place cards on bottom',
            limit: ability.limit.perRound(1),
            target: {
                mode: 'exactly',
                numCards: 3,
                activePromptTitle: 'Select cards (last chosen on bottom)',
                cardCondition: (card) =>
                    card.location === 'discard pile' && card.controller !== this.controller,
                ordered: true
            },
            message: {
                format: "{player} uses {source} to place {target} on the bottom of {controller}'s deck",
                args: { controller: (context) => context.target.controller }
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously((context) =>
                        context.target.map((card) =>
                            GameActions.returnCardToDeck({ card, bottom: true, orderable: false })
                        )
                    ).then(() => ({
                        message: 'Then, {player} draws 1 card and gains 1 gold',
                        gameAction: GameActions.simultaneously((context) => [
                            GameActions.drawCards({ player: context.player, amount: 1 }),
                            GameActions.gainGold({ player: context.player, amount: 1 })
                        ])
                    })),
                    context
                );
            }
        });
    }
}

GwynesseHarlaw.code = '12007';

export default GwynesseHarlaw;
