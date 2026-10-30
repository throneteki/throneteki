import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AlesterFlorent extends DrawCard {
    // Alester Florent (14007)
    // Reaction: After a House Florent character enters play, draw a card. (Limit once per round.)
    // Interrupt: When Alester Florent leaves play, if you control another R'hllor character, choose
    // and kneel a character an opponent controls.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card.hasTrait('House Florent')
            },
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 })),
            limit: ability.limit.perRound(1)
        });

        this.interrupt({
            when: {
                onCardLeftPlay: (event, context) =>
                    event.card === context.source &&
                    context.player.anyCardsInPlay(
                        (card) =>
                            card !== context.source &&
                            card.getType() === 'character' &&
                            card.hasTrait("R'hllor")
                    )
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller !== context.player,
                gameAction: 'kneel'
            },
            message: '{player} uses {source} to kneel {target}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.target }))
        });
    }
}

AlesterFlorent.code = '14007';

export default AlesterFlorent;
