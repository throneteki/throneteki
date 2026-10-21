import DrawCard from '../../drawcard.js';

class SerDavosSeaworth extends DrawCard {
    // Ser Davos Seaworth (04087)
    // Stealth.
    // Reaction: After Ser Davos Seaworth bypasses a non-loyal character using stealth, either: draw
    // 1 card, or gain 1 gold.
    setupCardAbilities() {
        this.reaction({
            when: {
                onBypassedByStealth: (event) => event.source === this && !event.target.isLoyal()
            },
            choices: {
                'Draw 1 card': () => {
                    if (this.controller.canDraw()) {
                        this.controller.drawCardsToHand(1);
                        this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
                    }
                },
                'Gain 1 gold': () => {
                    if (this.controller.canGainGold()) {
                        this.game.addGold(this.controller, 1);
                        this.game.addMessage('{0} uses {1} to gain 1 gold', this.controller, this);
                    }
                }
            }
        });
    }
}

SerDavosSeaworth.code = '04087';

export default SerDavosSeaworth;
