import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class EllariaSand extends DrawCard {
    // Ellaria Sand (06075)
    // Bestow (3).
    // Reaction: After you lose a challenge in which Ellaria Sand is participating, discard 1 gold
    // from her to stand each Bastard character you control.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.controller === event.challenge.loser &&
                    context.source.isParticipating()
            },
            cost: ability.costs.discardGold(),
            message: {
                format: '{player} discards 1 gold from {source} to stand {cards}',
                args: {
                    cards: (context) =>
                        context.player.filterCardsInPlay(
                            (card) => card.hasTrait('Bastard') && card.getType() === 'character'
                        )
                }
            },
            gameAction: GameActions.simultaneously((context) =>
                context.player
                    .filterCardsInPlay(
                        (card) => card.hasTrait('Bastard') && card.getType() === 'character'
                    )
                    .map((card) => GameActions.standCard({ card }))
            )
        });
    }
}

EllariaSand.code = '06075';

export default EllariaSand;
