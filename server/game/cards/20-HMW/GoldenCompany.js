import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class GoldenCompany extends DrawCard {
    // Golden Company (20031)
    // Bestow (1).
    // While Golden Company has 1 or more gold, it gains renown.
    // Interrupt: When a Mercenary character would be returned to your hand, discard 1 gold from
    // Golden Company to save that character.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.hasToken(Tokens.gold),
            match: this,
            effect: ability.effects.addKeyword('Renown')
        });

        this.interrupt({
            canCancel: true,
            when: {
                onCardReturnedToHand: (event, context) =>
                    event.allowSave &&
                    event.card.getType() === 'character' &&
                    event.card.hasTrait('Mercenary') &&
                    event.card.location === 'play area' &&
                    event.card.owner === context.source.controller //check for owner of the returned card in case mercenary card got stolen by the opponent
            },
            cost: ability.costs.discardGold(),
            message: {
                format: '{player} discards 1 gold from {source} to save {card}',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.saveCard((context) => ({ event: context.event }))
        });
    }
}

GoldenCompany.code = '20031';

export default GoldenCompany;
