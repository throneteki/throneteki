import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WingedKnight extends DrawCard {
    // Winged Knight (23029)
    // Interrupt: When a Lord or Lady character is killed, sacrifice Winged Knight to remove that
    // character from the game instead of placing it in its owner's dead pile.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: (event) => event.card.isMatch({ trait: ['Lord', 'Lady'] })
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: "{player} sacrifices {source} to remove {character} from the game instead of placing it in its owner's dead pile",
                args: { character: (context) => context.event.card }
            },
            gameAction: GameActions.replaceEvent((context) => ({
                event: context.event,
                replacement: GameActions.placeCard({
                    card: context.event.card,
                    location: 'out of game'
                })
            }))
        });
    }
}

WingedKnight.code = '23029';

export default WingedKnight;
