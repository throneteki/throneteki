import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BlackwaterRaiders extends DrawCard {
    // Blackwater Raiders (13111)
    // Shadow (3).
    // Reaction: After Blackwater Raiders comes out of shadows, choose a location with printed cost
    // 2 or lower in an opponent's discard pile. Put it into play under your control.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card, context) =>
                    card.getType() === 'location' &&
                    card.location === 'discard pile' &&
                    context.source.controller.canPutIntoPlay(card) &&
                    card.controller !== context.source.controller &&
                    card.getPrintedCost() <= 2
            },
            message: {
                format: "{player} uses {source} to put {target} into play from {owner}'s discard pile ",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

BlackwaterRaiders.code = '13111';

export default BlackwaterRaiders;
