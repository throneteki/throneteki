import DrawCard from '../../drawcard.js';

class VaesTolorro extends DrawCard {
    // Vaes Tolorro (04074)
    // Interrupt: When a character with 1 or more power is killed, kneel Vaes Tolorro to move 1
    // power from that character to Vaes Tolorro. (Up to 2 power instead if that character's STR is
    // 0.)
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: (event) => event.card.getPower() >= 1
            },
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                let pendingCard = context.event.card;
                let power = pendingCard.getPower() >= 2 && pendingCard.getStrength() === 0 ? 2 : 1;

                this.game.movePower(pendingCard, this, power);
                this.game.addMessage(
                    '{0} kneels {1} to move {2} power from {3} to {1}',
                    this.controller,
                    this,
                    power,
                    pendingCard
                );
            }
        });
    }
}

VaesTolorro.code = '04074';

export default VaesTolorro;
