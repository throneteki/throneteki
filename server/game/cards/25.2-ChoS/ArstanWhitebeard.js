import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class ArstanWhitebeard extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardEntersPlay']);
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                !this.controller.anyCardsInPlay({ type: 'character', trait: ['Lord', 'Lady'] }),
            match: this,
            effect: ability.effects.cannotBeKneeled()
        });
    }

    onCardEntersPlay(event) {
        let card = event.card;
        if (card.controller === this.controller && card.name === 'Ser Barristan Selmy') {
            this.game.resolveGameAction(GameActions.sacrificeCard({ card: this }));
        }
    }
}

ArstanWhitebeard.code = '25033';

export default ArstanWhitebeard;
