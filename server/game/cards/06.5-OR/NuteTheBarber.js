import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NuteTheBarber extends DrawCard {
    // Nute the Barber (06091)
    // Pillage.
    // Reaction: After a character you control discards a card using pillage, return a card from the
    // losing opponent's discard pile to its owner's hand. Then, draw 1 card. (Limit 3 times per
    // phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.isPillage && event.source.controller === context.player
            },
            limit: ability.limit.perPhase(3),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.controller === context.game.currentChallenge.loser
            },
            message: {
                format: "{player} uses {source} to return {target} to {owner}'s hand",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target })).then({
                message: 'Then {player} draws 1 card',
                gameAction: GameActions.drawCards((context) => ({
                    player: context.player,
                    amount: 1
                }))
            })
        });
    }
}

NuteTheBarber.code = '06091';

export default NuteTheBarber;
