import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OurWordIsGoodAsGold extends DrawCard {
    // Our Word Is Good as Gold (20033)
    // Action: Search the top 10 cards of your deck for a Mercenary character and put it into play.
    // Shuffle your deck. At the end of the phase, if that card is still in play, return it to your
    // hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Search deck for Mercenary',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', trait: 'Mercenary' },
                topCards: 10,
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

OurWordIsGoodAsGold.code = '20033';

export default OurWordIsGoodAsGold;
