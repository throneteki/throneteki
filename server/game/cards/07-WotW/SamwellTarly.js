import DrawCard from '../../drawcard.js';

class SamwellTarly extends DrawCard {
    // Samwell Tarly (07012)
    // While Samwell Tarly is participating in a challenge, treat each other participating
    // non-Steward character as if its printed text box were blank (except for Traits).
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            match: (card, context) =>
                card !== context.source &&
                card.isParticipating() &&
                !card.hasTrait('Steward') &&
                card.getType() === 'character',
            targetController: 'any',
            effect: ability.effects.blankExcludingTraits
        });
    }
}

SamwellTarly.code = '07012';

export default SamwellTarly;
