import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';
import { flatten } from '../../../Array.js';

class VargoHoat extends DrawCard {
    // Vargo Hoat (18017)
    // Bestow (2).
    // Reaction: After a card with bestow enters play, it gains 1 gold. (Limit twice per phase.)
    // Action: Move 1 gold from Vargo Hoat to a character with 2 or less gold. Until the end of the
    // phase, Vargo Hoat gains that character's keywords.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.getType() !== 'plot' && event.card.isBestow()
            },
            message: {
                format: '{player} uses {source} to have {card} gain 1 gold',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.placeToken((context) => ({
                card: context.event.card,
                token: Tokens.gold
            })),
            limit: ability.limit.perPhase(2)
        });
        this.action({
            title: 'Move 1 gold to character',
            condition: (context) => context.source.hasToken(Tokens.gold),
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    (!card.hasToken(Tokens.gold) || card.tokens[Tokens.gold] < 3)
            },
            message:
                "{player} uses {source} to move 1 gold from {source} to {target} to have {source} gain {target}'s keywords",
            gameAction: GameActions.transferGold((context) => ({
                from: context.source,
                to: context.target,
                amount: 1
            })).then({
                // The keywords are read once the gold has moved, as gold can give the target a
                // keyword (for example Golden Company)
                gameAction: GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    match: context.source,
                    effect: flatten(
                        context.parentContext.target
                            .getKeywords()
                            .map((keyword) => ability.effects.addKeyword(keyword))
                    )
                }))
            })
        });
    }
}

VargoHoat.code = '18017';

export default VargoHoat;
