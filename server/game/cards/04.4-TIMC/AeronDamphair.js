import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AeronDamphair extends DrawCard {
    // Aeron Damphair (04071)
    // Reaction: After a character is saved, either: stand it, or kneel it.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardSaved: (event) => event.card.getType() === 'character'
            },
            gameAction: GameActions.choose({
                choices: {
                    Stand: {
                        message: {
                            format: '{player} uses {source} to stand {card}',
                            args: { card: (context) => context.event.card }
                        },
                        gameAction: GameActions.standCard((context) => ({
                            card: context.event.card
                        }))
                    },
                    Kneel: {
                        message: {
                            format: '{player} uses {source} to kneel {card}',
                            args: { card: (context) => context.event.card }
                        },
                        gameAction: GameActions.kneelCard((context) => ({
                            card: context.event.card
                        }))
                    }
                }
            })
        });
    }
}

AeronDamphair.code = '04071';

export default AeronDamphair;
