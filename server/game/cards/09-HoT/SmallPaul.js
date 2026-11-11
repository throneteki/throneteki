import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SmallPaul extends DrawCard {
    // Small Paul (09033)
    // No attachments except Weapon.
    // Interrupt: When Small Paul is killed, search the top X cards of your deck for any number of
    // Steward characters, reveal them, and add them to your hand. X is your reserve value. Shuffle
    // your deck.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, context) => event.card === context.source
            },
            message: {
                format: '{player} uses {source} to search the top {reserve} cards of their deck for any number of Steward characters',
                args: { reserve: (context) => context.source.controller.getReserve() }
            },
            gameAction: GameActions.search({
                title: 'Select any number of characters',
                numToSelect: (context) => context.player.getReserve(),
                topCards: (context) => context.player.getReserve(),
                match: { type: 'character', trait: 'Steward' },
                message: '{player} adds {searchTarget} to their hand',
                gameAction: GameActions.simultaneously((context) =>
                    context.searchTarget.map((card) => GameActions.addToHand({ card }))
                )
            })
        });
    }
}

SmallPaul.code = '09033';

export default SmallPaul;
