import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterOfTheTor extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            message: '{player} uses {source} to place the top card of their deck into shadows',
            gameAction: GameActions.placeCard((context) => ({
                card: context.player.drawDeck[0],
                location: 'shadows'
            }))
        });
    }
}

MaesterOfTheTor.code = '26007';

export default MaesterOfTheTor;
