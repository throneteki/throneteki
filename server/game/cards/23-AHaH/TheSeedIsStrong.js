import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheSeedIsStrong extends DrawCard {
    // The Seed is Strong (23037)
    // Reaction: After you lose initiative, the winning opponent must choose and discard a Lord or
    // Lady character from their hand or shadows area unless they reveal a hand and shadows area
    // containing no Lord or Lady characters.
    setupCardAbilities() {
        this.reaction({
            when: {
                onInitiativeDetermined: (event, context) => event.winner !== context.player
            },
            message: {
                format: '{player} uses {source} to have {winner} discard a Lord or Lady from their hand or shadows area, or reveal their hand and shadows area',
                args: { winner: (context) => context.event.winner }
            },
            gameAction: GameActions.ifCondition({
                condition: (context) =>
                    context.event.winner.hand.some((card) =>
                        card.isMatch({ trait: ['Lord', 'Lady'] })
                    ) ||
                    context.event.winner.shadows.some((card) =>
                        card.isMatch({ trait: ['Lord', 'Lady'] })
                    ),
                thenAction: GameActions.chooseCards({
                    player: (context) => context.event.winner,
                    title: 'Select a Lord or Lady to discard',
                    cardCondition: (card, context) =>
                        ['hand', 'shadows'].includes(card.location) &&
                        card.isMatch({ trait: ['Lord', 'Lady'] }) &&
                        card.controller === context.choosingPlayer,
                    gameAction: (card) => GameActions.discardCard({ card })
                }),
                elseAction: {
                    message: '{player} {gameAction}, containing no Lord or Lady characters',
                    gameAction: GameActions.revealCards((context) => ({
                        cards: [...context.event.winner.hand, ...context.event.winner.shadows],
                        revealWithMessage: false
                    }))
                }
            })
        });
    }
}

TheSeedIsStrong.code = '23037';

export default TheSeedIsStrong;
