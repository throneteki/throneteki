import DrawCard from '../../drawcard.js';

class HighgardenMinstrel extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event) =>
                    event.card.hasTrait('Song') &&
                    event.card.controller === this.controller &&
                    this.controller.canGainGold()
            },
            limit: ability.limit.perRound(3),
            handler: () => {
                this.game.addGold(this.controller, 1);
                this.game.addMessage('{0} uses {1} to gain 1 gold', this.controller, this);
            }
        });
    }
}

HighgardenMinstrel.code = '06103';

export default HighgardenMinstrel;
