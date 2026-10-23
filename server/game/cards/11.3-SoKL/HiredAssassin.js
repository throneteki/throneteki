import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HiredAssassin extends DrawCard {
    // Hired Assassin (11053)
    // Shadow (2).
    // Reaction: After Hired Assassin comes out of shadows, look at a card in shadows. If it is a
    // character, you may place it in its owner's dead pile.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                type: 'select',
                activePromptTitle: 'Select a card in shadows',
                cardCondition: (card) => card.location === 'shadows'
            },
            message: {
                format: '{player} uses {source} to look at a card in shadows controlled by {controller}',
                args: { controller: (context) => context.target.controller }
            },
            gameAction: GameActions.ifCondition({
                condition: (context) => context.target.getType() === 'character',
                thenAction: GameActions.chooseCards({
                    optional: true,
                    revealTargets: true,
                    title: "Select character to place in its owner's dead pile, or click done",
                    cardCondition: (card, context) => card === context.target,
                    gameAction: (card, context) =>
                        GameActions.placeCard({
                            card,
                            location: 'dead pile',
                            player: context.player
                        })
                }),
                elseAction: GameActions.lookAtCards((context) => ({
                    player: context.player,
                    cards: [context.target]
                }))
            })
        });
    }
}

HiredAssassin.code = '11053';

export default HiredAssassin;
