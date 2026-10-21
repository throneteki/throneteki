import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheWatchHasNeed extends DrawCard {
    // The Watch Has Need (02002)
    // Action: Name a trait: Builder, Ranger, or Steward. Search the top X cards of your deck for
    // any number of characters with that trait, reveal them, and add them to your hand. Shuffle the
    // other cards back into your deck. X is your reserve value.
    setupCardAbilities() {
        this.action({
            title: 'Search for a character',
            condition: () => this.controller.getReserve() > 0,
            message: {
                format: '{player} plays {source} to name a trait and search the top {reserve} cards of their deck',
                args: { reserve: (context) => context.player.getReserve() }
            },
            gameAction: GameActions.choose({
                player: () => this.controller,
                title: 'Select a trait',
                message: '{choosingPlayer} names the {choice} trait',
                choices: {
                    Builder: this.gameActionForTrait('Builder'),
                    Ranger: this.gameActionForTrait('Ranger'),
                    Steward: this.gameActionForTrait('Steward')
                }
            })
        });
    }

    gameActionForTrait(trait) {
        return GameActions.search({
            title: 'Select a character',
            match: { trait: trait },
            numToSelect: (context) => context.player.getReserve(),
            topCards: (context) => context.player.getReserve(),
            message: '{player} adds {searchTarget} to their hand',
            gameAction: GameActions.simultaneously((context) =>
                context.searchTarget.map((card) => GameActions.addToHand({ card }))
            )
        });
    }
}

TheWatchHasNeed.code = '02002';

export default TheWatchHasNeed;
