import DrawCard from '../../drawcard.js';

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
                format: "{player} sacrifices {source} to remove {character} from the game instead of placing it in it's owners dead pile",
                args: { character: (context) => context.event.card }
            },
            handler: (context) => {
                context.replaceHandler(() => {
                    context.event.cardStateWhenKilled = context.event.card.createSnapshot();
                    this.controller.moveCard(context.event.card, 'out of game');
                });
            }
        });
    }
}

WingedKnight.code = '23029';

export default WingedKnight;
