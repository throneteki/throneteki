import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BloodOfMyBlood extends DrawCard {
    // Blood of My Blood (04054)
    // Challenges Action: Search your deck for a Bloodrider character and put it into play. Shuffle
    // your deck. At the end of the phase, if that card is still in play, return it to your hand.
    setupCardAbilities() {
        this.action({
            title: 'Search deck for Bloodrider',
            phase: 'challenge',
            message: '{player} plays {source} to search their deck for a Bloodrider character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', trait: 'Bloodrider' },
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

BloodOfMyBlood.code = '04054';

export default BloodOfMyBlood;
