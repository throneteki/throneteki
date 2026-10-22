import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShowOfStrength extends DrawCard {
    // Show of Strength (13024)
    // Challenges Action: Until the end of the phase, treat each character with STR 3 or lower as if
    // its printed text box were blank (except for Traits).
    setupCardAbilities(ability) {
        this.action({
            phase: 'challenge',
            condition: (context) => context.source.getLowStrengthCharacters().length > 0,
            message: {
                format: '{player} plays {source} to treat {lowStrengthCharacters} as blank',
                args: {
                    lowStrengthCharacters: (context) => context.source.getLowStrengthCharacters()
                }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.source.getLowStrengthCharacters(),
                effect: ability.effects.blankExcludingTraits
            }))
        });
    }

    getLowStrengthCharacters() {
        return this.game.filterCardsInPlay(
            (card) => card.getType() === 'character' && card.getStrength() <= 3
        );
    }
}

ShowOfStrength.code = '13024';

export default ShowOfStrength;
