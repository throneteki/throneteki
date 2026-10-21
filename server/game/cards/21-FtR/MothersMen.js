import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MothersMen extends DrawCard {
    // Mother's Men (21020)
    // Assault. No attachments.
    // Reaction: After an opponent’s character is killed by a card effect, put Mother's Men into
    // play from your discard pile.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCharacterKilled: (event, context) =>
                    !context.game.claim.isApplying &&
                    event.card.controller !== context.player &&
                    context.player.canPutIntoPlay(context.source)
            },
            location: 'discard pile',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source
            })),
            message: '{player} puts {source} into play from their discard pile'
        });
    }
}

MothersMen.code = '21020';

export default MothersMen;
