import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class LyseniPirate extends DrawCard {
    // Lyseni Pirate (08047)
    // While you control a Warship location, Lyseni Pirate gains stealth.
    // Reaction: After you win a challenge in which Lyseni Pirate is attacking, move 1 gold from the
    // losing opponent’s gold pool or a card that player controls to your gold pool.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.source.controller.anyCardsInPlay(
                    (card) => card.hasTrait('Warship') && card.getType() === 'location'
                ),
            match: (card, context) => card === context.source,
            effect: ability.effects.addKeyword('stealth')
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    context.source.isAttacking() &&
                    (loserHasGold(context) || loserHasGoldOnCard(context))
            },
            gameAction: GameActions.ifCondition({
                condition: (context) => loserHasGold(context) && loserHasGoldOnCard(context),
                thenAction: GameActions.choose({
                    title: 'Move gold from gold pool or card?',
                    choices: { 'Gold pool': fromGoldPool(), Card: fromCard() }
                }),
                elseAction: GameActions.ifCondition({
                    condition: (context) => loserHasGold(context),
                    thenAction: fromGoldPool(),
                    elseAction: fromCard()
                })
            })
        });
    }
}

function loserHasGold(context) {
    return context.event.challenge.loser.gold >= 1;
}

function loserHasGoldOnCard(context) {
    return context.event.challenge.loser.anyCardsInPlay((card) => card.hasToken(Tokens.gold));
}

function fromGoldPool() {
    return {
        message: {
            format: "{player} uses {source} to move 1 gold from {loser}'s gold pool to their own",
            args: { loser: (context) => context.event.challenge.loser }
        },
        gameAction: GameActions.transferGold((context) => ({
            from: context.event.challenge.loser,
            to: context.player,
            amount: 1
        }))
    };
}

function fromCard() {
    return {
        message: {
            format: '{player} uses {source} to move 1 gold from a card {loser} controls to their gold pool',
            args: { loser: (context) => context.event.challenge.loser }
        },
        gameAction: GameActions.chooseCards({
            title: 'Select a card',
            cardCondition: (card, context) =>
                card.location === 'play area' &&
                card.controller === context.event.challenge.loser &&
                card.hasToken(Tokens.gold),
            gameAction: (card, context) =>
                GameActions.transferGold({ from: card, to: context.player, amount: 1 })
        })
    };
}

LyseniPirate.code = '08047';

export default LyseniPirate;
