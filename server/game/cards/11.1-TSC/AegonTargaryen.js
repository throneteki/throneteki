import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AegonTargaryen extends DrawCard {
    // Aegon Targaryen (11014)
    // Shadow (3).
    // Reaction: After Aegon Targaryen enters play, search your deck for an Army or Mercenary
    // character, put it into play, and shuffle your deck. At the end of the phase, if that card is
    // still in play, return it to your hand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            message:
                '{player} uses {source} to search their deck for an Army or Mercenary character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', trait: ['Army', 'Mercenary'] },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                })).then({
                    gameAction: GameActions.lastingEffect((context) => ({
                        duration: 'atEndOfPhase',
                        match: context.event.card,
                        condition: () =>
                            ['play area', 'duplicate'].includes(context.event.card.location),
                        targetLocation: 'any',
                        effect: ability.effects.returnToHandIfStillInPlay(true)
                    }))
                })
            })
        });
    }
}

AegonTargaryen.code = '11014';

export default AegonTargaryen;
