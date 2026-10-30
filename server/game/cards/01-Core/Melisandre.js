import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Melisandre extends DrawCard {
    // Melisandre (01047)
    // Reaction: After you marshal or play a R'hllor card, choose and kneel a character. (Limit once
    // per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.playingType === 'marshal' &&
                    event.card.controller === context.source.controller &&
                    event.card.hasTrait("R'hllor"),
                onCardPlayed: (event, context) =>
                    event.card.controller === context.source.controller &&
                    event.card.hasTrait("R'hllor")
            },
            limit: ability.limit.perRound(1),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.kneeled,
                gameAction: 'kneel'
            },
            message: '{player} uses {source} to kneel {target}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.target }))
        });
    }
}

Melisandre.code = '01047';

export default Melisandre;
