import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerBorosBlount extends DrawCard {
    // Ser Boros Blount (19006)
    // Ambush (3). Shadow (1).
    // Reaction: After Ser Boros Blount enters play, search the top 10 cards of your deck for a
    // Kingsguard character or a non-[lannister] Knight character and put it into play. Shuffle your
    // deck. At the end of the phase, if that card is still in play, discard it from play.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            message:
                '{player} uses {source} to search the top 10 cards of their deck for a Kingsguard or non-Lannister Knight character',
            gameAction: GameActions.search({
                title: 'Select a character',
                topCards: 10,
                match: {
                    type: 'character',
                    or: [
                        { trait: ['Knight'], not: { faction: 'lannister' } },
                        { trait: ['Kingsguard'] }
                    ]
                },
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
                                    gameAction: GameActions.discardCard({ card, allowSave: true })
                                }
                            })
                        };
                    })
                })
            })
        });
    }
}

SerBorosBlount.code = '19006';

export default SerBorosBlount;
