import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class ExchangeOfInformation extends PlotCard {
    // Exchange of Information (11020)
    // When Revealed: Choose an opponent and reveal the top 10 cards of your deck. That opponent
    // chooses 1 character, 1 location, 1 attachment, and 1 event revealed this way, if able, and
    // adds them to your hand. Shuffle your deck.
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            message:
                '{player} uses {source} to choose an opponent and reveal the top 10 cards of their deck',
            gameAction: GameActions.revealTopCards((context) => ({
                player: context.player,
                amount: 10,
                whileRevealed: GameActions.simultaneously(
                    ['character', 'location', 'attachment', 'event'].map((cardType) =>
                        GameActions.chooseCards({
                            player: (context) => context.opponent,
                            title: (context) =>
                                `Select ${['attachment', 'event'].includes(cardType) ? 'an' : 'a'} ${cardType} for ${context.player.name}`,
                            cardCondition: (card, context) =>
                                context.revealed.includes(card) && card.getType() === cardType,
                            gameAction: (card) => GameActions.addToHand({ card })
                        })
                    )
                )
            })).then({
                message: '{player} {gameAction}',
                gameAction: GameActions.shuffle((context) => ({ player: context.player }))
            })
        });
    }
}

ExchangeOfInformation.code = '11020';

export default ExchangeOfInformation;
