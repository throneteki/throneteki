import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class WardensOfTheSouth extends PlotCard {
    // Wardens of the South (09046)
    // Reaction: After a [tyrell] character you control is declared as an attacker or defender, that
    // character gets +2 STR until the end of the challenge.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDeclaredAsAttacker: (event, context) =>
                    event.card.controller === context.source.controller &&
                    event.card.isFaction('tyrell'),
                onDeclaredAsDefender: (event, context) =>
                    event.card.controller === context.source.controller &&
                    event.card.isFaction('tyrell')
            },
            message: {
                format: '{player} uses {source} to give {card} +2 STR until the end of the challenge',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.event.card,
                effect: ability.effects.modifyStrength(2)
            }))
        });
    }
}

WardensOfTheSouth.code = '09046';

export default WardensOfTheSouth;
