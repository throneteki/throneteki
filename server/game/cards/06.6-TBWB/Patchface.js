import DrawCard from '../../drawcard.js';

const Icons = ['Military', 'Intrigue', 'Power'];

class Patchface extends DrawCard {
    // Patchface (06107)
    // While another Fool character has a keyword, Patchface gains that keyword.
    // While another Fool character has a challenge icon, Patchface gains that challenge icon.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: [
                ability.effects.dynamicKeywordSources(
                    (card, context) =>
                        card.isMatch({ type: 'character', trait: 'Fool' }) &&
                        card !== context.source
                ),
                ability.effects.dynamicIcons((patchface) => foolIcons(patchface))
            ]
        });
    }
}

function foolIcons(patchface) {
    let foolIcons = [];
    let fools = patchface.game.filterCardsInPlay(
        (card) => card.getType() === 'character' && card.hasTrait('Fool') && card !== patchface
    );

    for (let card of fools) {
        for (let icon of Icons) {
            if (card.hasIcon(icon)) {
                foolIcons.push(icon);
            }
        }
    }

    return foolIcons;
}

Patchface.code = '06107';

export default Patchface;
