import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MothersMen extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCharacterKilled: (event, context) =>
                    !this.game.claim.isApplying &&
                    event.card.controller !== context.player &&
                    context.player.canPutIntoPlay(this)
            },
            location: 'discard pile',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: this
            })),
            message: '{player} puts {source} into play from their discard pile'
        });
    }
}

MothersMen.code = '21020';

export default MothersMen;
