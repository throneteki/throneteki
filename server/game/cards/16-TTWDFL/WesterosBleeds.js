import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WesterosBleeds extends DrawCard {
    // Westeros Bleeds (16026)
    // Dominance Action: Discard each character from play.
    setupCardAbilities() {
        this.action({
            title: 'Discard characters',
            phase: 'dominance',
            message: {
                format: '{player} plays {source} to discard {characters}',
                args: { characters: () => this.getCharactersInPlay() }
            },
            gameAction: GameActions.simultaneously(() =>
                this.getCharactersInPlay().map((card) => GameActions.discardCard({ card }))
            )
        });
    }

    getCharactersInPlay() {
        return this.game.filterCardsInPlay((card) => card.getType() === 'character');
    }
}

WesterosBleeds.code = '16026';

export default WesterosBleeds;
