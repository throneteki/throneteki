import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerArchibaldYronwood extends DrawCard {
    // Ser Archibald Yronwood (11055)
    // Shadow (4). No attachments except Weapon.
    // Reaction: After you lose dominance, the winning opponent must choose and kill a character he
    // or she controls.
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event, context) =>
                    event.winner && event.winner !== context.player
            },
            message: {
                format: '{player} uses {source} to have {winner} choose and kill a character they control',
                args: { winner: (context) => context.event.winner }
            },
            gameAction: GameActions.chooseCards({
                player: (context) => context.event.winner,
                title: 'Select a character to kill',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === context.choosingPlayer,
                gameAction: (card) => GameActions.kill({ card })
            })
        });
    }
}

SerArchibaldYronwood.code = '11055';

export default SerArchibaldYronwood;
