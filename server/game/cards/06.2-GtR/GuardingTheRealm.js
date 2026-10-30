import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GuardingTheRealm extends DrawCard {
    // Guarding the Realm (06026)
    // Marshaling Action: Choose a character with printed cost 3 or lower in an opponent's discard
    // pile, and put it into play under your control.
    // Reaction: After you win a challenge as the defending player, pay 1 gold to return Guarding
    // the Realm from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.action({
            title: 'Take control of character in discard pile',
            phase: 'marshal',
            target: {
                cardCondition: (card, context) =>
                    card.controller !== context.player &&
                    card.location === 'discard pile' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 3 &&
                    context.player.canPutIntoPlay(card)
            },
            message: {
                format: "{player} uses {source} to put {target} into play from {owner}'s discard pile under their control",
                args: { owner: (context) => context.target.owner }
            },
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
        this.reaction({
            location: 'discard pile',
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    !event.challenge.isAttackerTheWinner()
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            message: '{player} pays 1 gold to return {source} to their hand',
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.source }))
        });
    }
}

GuardingTheRealm.code = '06026';

export default GuardingTheRealm;
