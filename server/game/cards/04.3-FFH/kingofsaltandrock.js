const DrawCard = require('../../drawcard.js');

class KingOfSaltAndRock extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Ironborn' });
        this.whileAttached({
            effect: [
                ability.effects.addTrait('King'),
                ability.effects.addKeyword('Pillage')
            ]
        });
        this.reaction({
            when: {
                onPillage: event => event.discardedCard.getType() === 'attachment' || event.discardedCard.getType() === 'location'
            },
            handler: () => {
                this.parent.modifyPower(1);
                this.game.addMessage('{0} uses {1} to have {2} gain 1 power', this.controller, this, this.parent);
            }
        });
    }
}

KingOfSaltAndRock.code = '04052';

module.exports = KingOfSaltAndRock;
