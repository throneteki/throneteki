import DrawCard from '../../drawcard.js';

class TheonGreyjoy extends DrawCard {
    // Theon Greyjoy (06051)
    // While Theon Greyjoy is attacking alone, each character with a higher STR than his does not
    // contribute its STR to the challenge.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge({ attackingAlone: context.source }),
            match: (card, context) =>
                card.getType() === 'character' && card.getStrength() > context.source.getStrength(),
            targetController: 'any',
            effect: ability.effects.doesNotContributeStrength()
        });
    }
}

TheonGreyjoy.code = '06051';

export default TheonGreyjoy;
