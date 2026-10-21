import DrawCard from '../../drawcard.js';

class AlayneStone extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardEntersPlay']);
    }

    onCardEntersPlay(event) {
        let card = event.card;
        if (card !== this && card.name !== 'Sansa Stark') {
            return;
        }

        let sansa = this.controller.cardsInPlay.find((card) => card.name === 'Sansa Stark');

        if (!sansa) {
            return;
        }

        this.controller.removeCardFromPile(this);
        sansa.addDuplicate(this);
    }

    // Alayne Stone (23020)
    // Stealth.
    // If you control Sansa Stark, place Alayne Stone on her as a duplicate.
    // While Alayne Stone is kneeling, players cannot trigger abilities on in-faction Lord or Lady
    // characters during the challenges phase.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: () => this.kneeled && this.game.currentPhase === 'challenge',
            effect: ability.effects.cannotTriggerCardAbilities(
                (ability) =>
                    ability.card.isMatch({ trait: ['Lord', 'Lady'] }) &&
                    ability.card.isFaction(ability.card.controller.faction.getPrintedFaction())
            )
        });
    }
}

AlayneStone.code = '23020';

export default AlayneStone;
