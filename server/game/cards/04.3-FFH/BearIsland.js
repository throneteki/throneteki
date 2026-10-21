import DrawCard from '../../drawcard.js';

class BearIsland extends DrawCard {
    // Bear Island (04042)
    // Reaction: After you marshal a loyal card, gain 1 gold. (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.getType() !== 'plot' &&
                    event.card.controller === this.controller &&
                    event.card.isLoyal() &&
                    event.playingType === 'marshal' &&
                    this.controller.canGainGold()
            },
            limit: ability.limit.perPhase(2),
            handler: () => {
                this.game.addGold(this.controller, 1);
                this.game.addMessage('{0} uses {1} to gain 1 gold', this.controller, this);
            }
        });
    }
}

BearIsland.code = '04042';

export default BearIsland;
