import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class SerAddamMarbrand extends DrawCard {
    // Ser Addam Marbrand (18005)
    // Reaction: After an Army or Knight card enters play under your control, Ser Addam Marbrand
    // gains 1 gold. (Limit once per phase.)
    // Reaction: After a character enters your discard pile, discard 1 gold from Ser Addam Marbrand
    // to return it to your hand. (Limit twice per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.controller === context.player &&
                    (event.card.hasTrait('Knight') || event.card.hasTrait('Army'))
            },
            limit: ability.limit.perPhase(1),
            gameAction: GameActions.placeToken((context) => ({
                card: context.source,
                token: Tokens.gold
            }))
        });
        this.reaction({
            when: {
                onCardPlaced: (event, context) =>
                    event.card.getType() === 'character' &&
                    event.card.owner === context.player &&
                    event.location === 'discard pile'
            },
            limit: ability.limit.perRound(2),
            cost: ability.costs.discardGold(),
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.event.card }))
        });
    }
}

SerAddamMarbrand.code = '18005';

export default SerAddamMarbrand;
