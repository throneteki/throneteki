import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class HeadsOnSpikes extends PlotCard {
    // Heads on Spikes (01013)
    // When Revealed: Choose an opponent. Discard 1 card at random from that player's hand. If that
    // card is a character, gain 2 power for your faction and place the discarded character in its
    // owner's dead pile.
    setupCardAbilities() {
        this.whenRevealed({
            chooseOpponent: true,
            message: "{player} uses {source} to discard a card at random from {opponent}'s hand",
            gameAction: GameActions.discardAtRandom((context) => ({
                amount: 1,
                player: context.opponent,
                discardEvent: (card) =>
                    GameActions.discardCard({
                        card,
                        allowSave: false,
                        destination: card.getType() === 'character' ? 'dead pile' : 'discard pile'
                    })
                        .then({
                            condition: () => card.getType() === 'character',
                            message: '{player} gains 2 power for their faction for {source}',
                            gameAction: GameActions.gainPower({
                                card: context.player.faction,
                                amount: 2
                            })
                        })
                        .createEvent(context)
            }))
        });
    }
}

HeadsOnSpikes.code = '01013';

export default HeadsOnSpikes;
