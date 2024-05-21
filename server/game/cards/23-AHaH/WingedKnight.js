import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WingedKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: (event) => event.card.isMatch({ trait: ['Lord', 'Lady'] })
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: "{player} sacrifices {source} to remove {character} from the game instead of placing it in it's owners dead pile",
                args: { character: (context) => context.event.card }
            },
            handler: (context) => {
                context.event.childEvent.placeCard.replace(
                    GameActions.removeFromGame({ card: context.event.card }).createEvent()
                );
            }
        });
    }
}

WingedKnight.code = '23029';

export default WingedKnight;
