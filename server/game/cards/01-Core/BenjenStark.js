import DrawCard from '../../drawcard.js';

class BenjenStark extends DrawCard {
    // Benjen Stark (01122)
    // Each Ranger character you control cannot be bypassed by stealth.
    // Interrupt: When Benjen Stark is killed, gain 2 power for your faction. Then, shuffle him back
    // into your deck instead of placing him in your dead pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.getType() === 'character' && card.hasTrait('Ranger'),
            effect: ability.effects.cannotBeBypassedByStealth()
        });
        this.interrupt({
            when: {
                onCharacterKilled: (event) =>
                    event.card === this && this.controller.canGainFactionPower()
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to gain 2 power for their faction and shuffles {1} back into their deck instead of placing it in their dead pile',
                    this.controller,
                    this
                );

                this.game.addPower(this.controller, 2);
                context.replaceHandler(() => {
                    context.event.cardStateWhenKilled = this.createSnapshot();
                    this.controller.moveCard(this, 'draw deck', {}, () => {
                        this.controller.shuffleDrawDeck();
                    });
                });
            }
        });
    }
}

BenjenStark.code = '01122';

export default BenjenStark;
