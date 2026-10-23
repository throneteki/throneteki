import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class Saltcliffe extends DrawCard {
    // Saltcliffe (20008)
    // Action: Kneel Saltcliffe to move 1 gold from the treasury or a card in play to a Raider
    // character without gold.
    setupCardAbilities(ability) {
        this.action({
            title: 'Move gold',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    !card.hasToken(Tokens.gold) &&
                    card.getType() === 'character' &&
                    card.hasTrait('Raider')
            },
            gameAction: GameActions.ifCondition({
                condition: (context) =>
                    context.game.anyCardsInPlay((card) => card.hasToken(Tokens.gold)),
                thenAction: GameActions.choose({
                    title: 'Move gold from treasury or card?',
                    choices: {
                        Treasury: fromTreasury(),
                        Card: {
                            message:
                                '{player} kneels {source} to move 1 gold from a card to {target}',
                            gameAction: GameActions.chooseCards({
                                title: 'Select a card',
                                cardCondition: (card) =>
                                    card.location === 'play area' && card.hasToken(Tokens.gold),
                                gameAction: (card, context) =>
                                    GameActions.transferGold({
                                        from: card,
                                        to: context.target,
                                        amount: 1
                                    })
                            })
                        }
                    }
                }),
                elseAction: fromTreasury()
            })
        });
    }
}

function fromTreasury() {
    return {
        message: '{player} kneels {source} to have {target} gain 1 gold',
        gameAction: GameActions.placeToken((context) => ({
            card: context.target,
            token: Tokens.gold,
            amount: 1
        }))
    };
}

Saltcliffe.code = '20008';

export default Saltcliffe;
