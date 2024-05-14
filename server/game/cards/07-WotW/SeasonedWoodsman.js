import DrawCard from '../../drawcard.js';

class SeasonedWoodsman extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event) =>
                    event.attachment.controller === this.controller &&
                    event.target === this &&
                    (this.controller.canGainGold() || this.controller.canDraw())
            },
            limit: ability.limit.perPhase(2),
            choices: {
                'Gain 1 gold': () => {
                    if (this.controller.canGainGold()) {
                        this.game.addGold(this.controller, 1);
                        this.game.addMessage('{0} uses {1} to gain 1 gold', this.controller, this);
                    }
                },
                'Draw 1 card': () => {
                    if (this.controller.canDraw()) {
                        this.controller.drawCardsToHand(1);
                        this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
                    }
                }
            }
        });
    }
}

SeasonedWoodsman.code = '07015';

export default SeasonedWoodsman;
