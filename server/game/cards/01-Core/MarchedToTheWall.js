const PlotCard = require('../../plotcard.js');

class MarchedToTheWall extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: (card, context) => card.location === 'play area' && card.controller === context.choosingPlayer && card.getType() === 'character'
            },
            handler: context => {
                let cards = context.targets.selections.map(selection => selection.value).filter(card => !!card);
                this.game.discardFromPlay(cards, { allowSave: false });
            }
        });
    }
}

MarchedToTheWall.code = '01015';

module.exports = MarchedToTheWall;
