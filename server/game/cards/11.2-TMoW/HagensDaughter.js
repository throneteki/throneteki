import DrawCard from '../../drawcard.js';

class HagensDaughter extends DrawCard {
    // Hagen's Daughter (11031)
    // Shadow (2).
    // Interrupt: When Hagen’s Daughter would be killed, save her and return her to shadows.
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    (event.allowSave || event.isBurn) && event.card === this && this.canBeSaved()
            },
            handler: (context) => {
                context.event.saveCard();
                context.player.moveCard(this, 'shadows');
                this.game.addMessage(
                    '{0} saves {1} and returns her to shadows',
                    context.player,
                    this
                );
            }
        });
    }
}

HagensDaughter.code = '11031';

export default HagensDaughter;
