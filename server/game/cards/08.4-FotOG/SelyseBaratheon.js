import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SelyseBaratheon extends DrawCard {
    // Selyse Baratheon (08067)
    // Forced Reaction: After you marshal Selyse Baratheon, kneel your faction card. Then, kneel
    // each non-Lady character.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && event.playingType === 'marshal'
            },
            message: '{player} is forced by {source} to kneel their faction card',
            gameAction: GameActions.kneelCard((context) => ({ card: context.player.faction })).then(
                {
                    message: 'Then {player} kneels each non-Lady character',
                    gameAction: GameActions.simultaneously((context) =>
                        context.game
                            .filterCardsInPlay(
                                (card) => !card.hasTrait('Lady') && card.getType() === 'character'
                            )
                            .map((card) => GameActions.kneelCard({ card }))
                    )
                }
            )
        });
    }
}

SelyseBaratheon.code = '08067';

export default SelyseBaratheon;
