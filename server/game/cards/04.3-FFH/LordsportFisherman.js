import DrawCard from '../../drawcard.js';

class LordsportFisherman extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'marshal'
            },
            handler: () => {
                let bottomCard = this.controller.drawDeck.slice(-1)[0];
                this.controller.moveCard(bottomCard, 'hand');

                this.game.addMessage(
                    '{0} uses {1} to draw the bottom card of their deck',
                    this.controller,
                    this
                );
            }
        });
    }
}

LordsportFisherman.code = '04051';

export default LordsportFisherman;
