import PlotCard from '../../plotcard.js';

class Confiscation extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card) => this.cardCondition(card)
            },
            handler: (context) => {
                let attachment = context.target;
                attachment.owner.discardCard(attachment);

                this.game.addMessage(
                    '{0} uses {1} to discard {2}',
                    context.player,
                    this,
                    attachment
                );
            }
        });
    }

    cardCondition(card) {
        return card.location === 'play area' && card.getType() === 'attachment';
    }
}

Confiscation.code = '01009';

export default Confiscation;
