import DrawCard from '../../drawcard.js';

class WhiteGraces extends DrawCard {
    // White Graces (26093)
    // Interrupt: When White Graces is discarded from your hand or deck, place it on a unique Lady
    // or Grace character as a duplicate instead of placing it in your discard pile.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardDiscarded: (event) =>
                    event.card === this &&
                    this.controller.canPutIntoPlay(this) &&
                    ['draw deck', 'hand'].includes(event.originalLocation)
            },
            location: ['hand', 'draw deck'],
            target: {
                type: 'select',
                cardCondition: {
                    unique: true,
                    type: 'character',
                    location: 'play area',
                    trait: ['Lady', 'Grace'],
                    controller: 'current',
                    condition: (card) => card.controller === card.owner
                }
            },
            message: '{player} uses {source} to put it into play as a duplicate on {target}',
            handler: (context) => {
                context.event.replaceHandler(() => {
                    this.controller.removeCardFromPile(this);
                    context.target.addDuplicate(this);
                });
            }
        });
    }
}

WhiteGraces.code = '26093';

export default WhiteGraces;
