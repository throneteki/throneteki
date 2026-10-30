import DrawCard from '../../drawcard.js';

class LynCorbray extends DrawCard {
    // Lyn Corbray (00017)
    // Stealth.
    // Each non-Army character you control with printed cost 6 or higher gets +2 STR.
    // Draft format only.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                !card.hasTrait('Army') &&
                card.getType() === 'character' &&
                card.getPrintedCost() >= 6,
            effect: ability.effects.modifyStrength(2)
        });
    }
}

LynCorbray.code = '00017';

export default LynCorbray;
