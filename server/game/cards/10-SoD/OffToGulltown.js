import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OffToGulltown extends DrawCard {
    // "Off To Gulltown" (10044)
    // Challenges Action: Choose a character. Until the end of the phase, that character gains a
    // [military], an [intrigue], and a [power] icon. Draw 1 card.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give icons to character',
            phase: 'challenge',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message:
                '{player} plays {source} to give a military, an intrigue, and a power icon to {target} until the end of the phase and draw 1 card',
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    match: context.target,
                    effect: [
                        ability.effects.addIcon('military'),
                        ability.effects.addIcon('intrigue'),
                        ability.effects.addIcon('power')
                    ]
                })),
                GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
            ])
        });
    }
}

OffToGulltown.code = '10044';

export default OffToGulltown;
