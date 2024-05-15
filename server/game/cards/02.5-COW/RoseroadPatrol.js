import DrawCard from '../../drawcard.js';

class RoseroadPatrol extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.hasCharacterWithHighestSTR(),
            match: this,
            effect: ability.effects.addKeyword('Stealth')
        });
    }

    hasCharacterWithHighestSTR() {
        let charactersInPlay = this.game.filterCardsInPlay(
            (card) => card.getType() === 'character'
        );
        let strengths = charactersInPlay.map((card) => card.getStrength());
        let highestStrength = Math.max(...strengths);

        return this.controller.anyCardsInPlay(
            (card) => card.getType() === 'character' && card.getStrength() >= highestStrength
        );
    }
}

RoseroadPatrol.code = '02083';

export default RoseroadPatrol;
