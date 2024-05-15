import PlotCard from '../../plotcard.js';

class FallenFromFavor extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.player &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                let card = context.target;
                context.player.sacrificeCard(card);
                this.game.addMessage('{0} sacrifices {1} for {2}', context.player, card, this);
            }
        });
    }
}

FallenFromFavor.code = '03047';

export default FallenFromFavor;
