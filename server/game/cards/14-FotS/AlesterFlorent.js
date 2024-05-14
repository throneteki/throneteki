import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AlesterFlorent extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.hasTrait('House Florent') && this.controller.canDraw()
            },
            message: '{player} uses {source} to draw 1 card',
            handler: (context) => {
                context.player.drawCardsToHand(1);
            },
            limit: ability.limit.perRound(1)
        });

        this.interrupt({
            when: {
                onCardLeftPlay: (event) =>
                    event.card === this &&
                    this.controller.anyCardsInPlay(
                        (card) =>
                            card !== this &&
                            card.getType() === 'character' &&
                            card.hasTrait("R'hllor")
                    )
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.kneeled &&
                    card.controller !== this.controller,
                gameAction: 'kneel'
            },
            message: '{player} uses {source} to kneel {target}',
            handler: (context) => {
                this.game.resolveGameAction(GameActions.kneelCard({ card: context.target }));
            }
        });
    }
}

AlesterFlorent.code = '14007';

export default AlesterFlorent;
