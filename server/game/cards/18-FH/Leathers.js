import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Leathers extends DrawCard {
    // Leathers (18010)
    // Each Giant character you control gains an [intrigue] icon.
    // Each Wildling character you control gains the [thenightswatch] affiliation.
    // Reaction: After Leathers enters play, search your deck for a Giant character, reveal it and
    // add it to your hand. Shuffle your deck.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card.controller === context.source.controller &&
                card.location === 'play area' &&
                card.getType() === 'character' &&
                card.hasTrait('Wildling'),
            effect: ability.effects.addFaction('thenightswatch')
        });

        this.persistentEffect({
            match: (card, context) =>
                card.controller === context.source.controller &&
                card.location === 'play area' &&
                card.getType() === 'character' &&
                card.hasTrait('Giant'),
            effect: ability.effects.addIcon('intrigue')
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            message: '{player} uses {source} to search their deck for a Giant character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { trait: 'Giant', type: 'character' },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

Leathers.code = '18010';

export default Leathers;
