import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LazyLeo extends DrawCard {
    // Lazy Leo (11043)
    // Shadow (2).
    // Reaction: After Lazy Leo comes out of shadows, choose a player. Shuffle any number of events
    // from that player's discard pile into his or her deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                type: 'select',
                activePromptTitle: 'Select any number of events',
                cardCondition: (card) =>
                    card.location === 'discard pile' && card.getType() === 'event',
                mode: 'unlimited',
                singleController: true
            },
            message: {
                format: "{player} uses {source} to shuffle {target} into {owner}'s deck",
                args: { owner: (context) => context.target[0].owner }
            },
            gameAction: GameActions.shuffleIntoDeck((context) => ({ cards: context.target }))
        });
    }
}

LazyLeo.code = '11043';

export default LazyLeo;
