import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OurWordIsGoodAsGold extends DrawCard {
    // Our Word Is Good as Gold (20033)
    // Action: Search the top 10 cards of your deck for a Mercenary character and put it into play.
    // Shuffle your deck. At the end of the phase, if that card is still in play, return it to your
    // hand.
    setupCardAbilities() {
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
                    gameAction: GameActions.delayedEffect((context) => {
                        const card = context.event.card;
                        return {
                            duration: 'untilTriggered',
                            title: card.name,
                            when: { onAtEndOfPhase: () => true },
                            until: { onCardLeftPlay: (event) => event.card === card },
                            gameAction: GameActions.ifCondition({
                                condition: () => ['play area', 'duplicate'].includes(card.location),
                                thenAction: {
                                    message:
                                        '{player} resolves the delayed effect from {source}: {gameAction}',
                                    gameAction: GameActions.returnCardToHand({
                                        card,
                                        allowSave: true
                                    })
                                }
                            })
                        };
                    })
                })
            })
        });
    }
}

OurWordIsGoodAsGold.code = '20033';

export default OurWordIsGoodAsGold;
