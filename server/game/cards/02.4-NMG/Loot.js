import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Loot extends DrawCard {
    // Loot (02073)
    // You may only use gold from the losing opponent's gold pool to pay for Loot.
    // Reaction: After you win an unopposed challenge, discard the top X cards from the losing
    // opponent's deck.
    setupCardAbilities() {
        this.xValue({
            min: () => 1,
            max: (context) => context.event.challenge.loser.drawDeck.length
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.player === event.challenge.winner && event.challenge.isUnopposed()
            },
            payingPlayer: (context) => context.event.challenge.loser,
            message: {
                format: "{player} plays {source} and pays {costs.gold} gold from {opponent}'s gold pool to discard the top {costs.gold} cards from {opponent}'s deck",
                args: { opponent: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.discardTopCards((context) => ({
                player: context.event.challenge.loser,
                amount: context.xValue
            }))
        });
    }
}

Loot.code = '02073';

export default Loot;
