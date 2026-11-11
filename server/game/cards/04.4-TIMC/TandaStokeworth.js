import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TandaStokeworth extends DrawCard {
    // Tanda Stokeworth (04069)
    // Reaction: After you marshal Tanda Stokeworth, each player gains 3 gold.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && event.playingType === 'marshal'
            },
            message: '{player} uses {source} to have each player gain 3 gold',
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .getPlayers()
                    .map((player) => GameActions.gainGold({ player, amount: 3 }))
            )
        });
    }
}

TandaStokeworth.code = '04069';

export default TandaStokeworth;
