import DrawCard from '../../drawcard.js';

class Esgred extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardEntersPlay']);
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyKeywordTriggerAmount('stealth', 1)
        });
    }

    onCardEntersPlay(event) {
        let card = event.card;
        if (card !== this && card.name !== 'Asha Greyjoy') {
            return;
        }

        let asha = this.controller.cardsInPlay.find((card) => card.name === 'Asha Greyjoy');

        if (!asha) {
            return;
        }

        this.controller.sacrificeCard(this);
        asha.modifyPower(1);
    }
}

Esgred.code = '04111';

export default Esgred;
