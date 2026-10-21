import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ANewHand extends DrawCard {
    // A New Hand (26062)
    // Reaction: After a Small Council character you control leaves play, search your deck for a
    // different Small Council character, reveal it, and add it to your hand. Shuffle your deck.
    // (Max 1 per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardLeftPlay: (event, context) =>
                    event.cardStateWhenLeftPlay.hasTrait('Small Council') &&
                    event.cardStateWhenLeftPlay.controller === context.source.controller
            },
            max: ability.limit.perPhase(1),
            gameAction: GameActions.search({
                title: 'Select a character',
                match: {
                    type: 'character',
                    trait: 'Small Council',
                    condition: (card, context) =>
                        card.name !== context.event.cardStateWhenLeftPlay.name
                },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

ANewHand.code = '26062';

export default ANewHand;
