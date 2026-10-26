import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RickonStark extends DrawCard {
    // Rickon Stark (03016)
    // Interrupt: When the effects of a triggered ability with the word "search" in it would
    // initiate, sacrifice Rickon Stark to cancel those effects.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    event.ability.isTriggeredAbility() &&
                    abilityTextIncludes(event.source, event.ability, 'search')
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {source} to cancel {eventSource}',
                args: { eventSource: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }
}

// The word has to be in the ability being used, not elsewhere on the card. No card has two
// triggered abilities of the same kind alongside the word, so the kind identifies the ability's text.
function abilityTextIncludes(card, ability, word) {
    const kind = abilityKind(ability);
    const paragraphs = (card.cardData.text || '')
        .split('\n')
        .map((paragraph) => paragraph.replace(/<[^>]+>/g, '').toLowerCase())
        .filter((paragraph) => paragraphKind(paragraph) === kind);

    if (paragraphs.length === 0) {
        return card.hasText(word);
    }

    return paragraphs.some((paragraph) => paragraph.includes(word));
}

function abilityKind(ability) {
    if (ability.isAction()) {
        return 'action';
    }

    return ability.eventType === 'wouldinterrupt' ? 'interrupt' : ability.eventType;
}

const paragraphKinds = {
    'forced reaction': 'forcedreaction',
    'forced interrupt': 'forcedinterrupt',
    reaction: 'reaction',
    interrupt: 'interrupt',
    'when revealed': 'whenrevealed'
};

function paragraphKind(paragraph) {
    const colon = paragraph.indexOf(':');
    const label = colon === -1 ? '' : paragraph.slice(0, colon).trim();

    if (paragraphKinds[label]) {
        return paragraphKinds[label];
    }

    return label.endsWith('action') ? 'action' : undefined;
}

RickonStark.code = '03016';

export default RickonStark;
