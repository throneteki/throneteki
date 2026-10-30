import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class GodryTheGiantslayer extends DrawCard {
    // Godry the Giantslayer (18002)
    // Bestow (1).
    // X is the number of gold Godry the Giantslayer has. While he has 5 or more gold, he gains
    // intimidate.
    // Reaction: After you marshal or play another Knight or R'hllor card, Godry the Giantslayer
    // gains 1 gold. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(
                (card, context) => context.source.tokens[Tokens.gold]
            )
        });
        this.persistentEffect({
            condition: (context) => context.source.tokens[Tokens.gold] >= 5,
            match: this,
            effect: ability.effects.addKeyword('Intimidate')
        });
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.playingType === 'marshal' &&
                    event.card !== context.source &&
                    event.card.controller === context.source.controller &&
                    (event.card.hasTrait("R'hllor") || event.card.hasTrait('Knight')),
                onCardPlayed: (event, context) =>
                    event.card.controller === context.source.controller &&
                    event.card.hasTrait("R'hllor")
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to have {source} gain 1 gold',
            gameAction: GameActions.placeToken((context) => ({
                card: context.source,
                token: Tokens.gold,
                amount: 1
            }))
        });
    }
}

GodryTheGiantslayer.code = '18002';

export default GodryTheGiantslayer;
