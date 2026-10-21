import DrawCard from '../../drawcard.js';

class CorpseLake extends DrawCard {
    // Corpse Lake (09028)
    // Reaction: After a character is discarded from an opponent's deck, Corpse Lake gains 1 power.
    // (Limit 3 times per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event) =>
                    event.originalLocation === 'draw deck' &&
                    event.card.getType() === 'character' &&
                    event.card.controller !== this.controller &&
                    this.allowGameAction('gainPower')
            },
            limit: ability.limit.perRound(3),
            handler: () => {
                this.modifyPower(1);
                this.game.addMessage('{0} gains 1 power on {1}', this.controller, this);
            }
        });
    }
}

CorpseLake.code = '09028';

export default CorpseLake;
