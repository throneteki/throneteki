import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ANewHand extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardLeftPlay: (event) =>
                    event.cardStateWhenLeftPlay.hasTrait('Small Council') &&
                    event.cardStateWhenLeftPlay.controller === this.controller
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
