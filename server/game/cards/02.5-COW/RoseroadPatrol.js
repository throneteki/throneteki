import DrawCard from '../../drawcard.js';

class RoseroadPatrol extends DrawCard {
    // Roseroad Patrol (02083)
    // No attachments.
    // While you control a character with the highest STR in play, Roseroad Patrol gains stealth.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.hasCharacterWithHighestSTR(),
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
