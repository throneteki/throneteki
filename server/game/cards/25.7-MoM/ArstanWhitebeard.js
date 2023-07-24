const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class ArstanWhitebeard extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardEntersPlay']);
    }
    
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.controller.anyCardsInPlay({ type: 'character', trait: ['Lord', 'Lady'] }),
            effect: ability.effects.cannotBeKneeled()
        });
    }

    onCardEntersPlay(event) {
        let card = event.card;
        if(card.controller === this.controller && card.name === 'Ser Barristan Selmy') {
            this.game.resolveGameAction(GameActions.sacrificeCard({ card: this }));
        }
    }
}

ArstanWhitebeard.code = '25576';
ArstanWhitebeard.version = '1.0';

module.exports = ArstanWhitebeard;
