import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerJaimeLannister extends DrawCard {
    // Ser Jaime Lannister (22007)
    // Renown.
    // Forced Reaction: After a character enters play during the challenges phase, stand Ser Jaime
    // Lannister. Then, discard that character from play.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: (event) =>
                    this.kneeled &&
                    this.game.currentPhase === 'challenge' &&
                    event.card.getType() === 'character'
            },
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard((context) => ({
                card: context.source
            })).then((preThenContext) => ({
                message: {
                    format: 'Then {player} discards {enteredPlay} from play',
                    args: { enteredPlay: () => preThenContext.event.card }
                },
                gameAction: GameActions.discardCard({
                    card: preThenContext.event.card
                })
            }))
        });
    }
}

SerJaimeLannister.code = '22007';

export default SerJaimeLannister;
