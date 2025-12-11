import DrawCard from '../../drawcard.js';

class WhiteGraces extends DrawCard {
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
