const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');
const { Tokens } = require('../../Constants');

class CasterlyRock extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.kneeled,
            match: (card) =>
                card.controller === this.controller &&
                card.location === 'play area' &&
                card.isFaction('lannister'),
            effect: ability.effects.canSpendGold(
                (spendParams) => spendParams.activePlayer === this.controller
            )
        });
        this.action({
            title: 'Select cards to gain gold',
            cost: ability.costs.kneelSelf(),
            phase: 'marshal',
            target: {
                mode: 'upTo',
                numCards: 3,
                activePromptTitle: 'Select up to 3 cards',
                cardCondition: (card) => card.location === 'play area'
            },
            message: '{player} kneels {source} to have {target} each gain 1 gold',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.simultaneously(
                        context.target.map((card) =>
                            GameActions.placeToken({ card, token: Tokens.gold, amount: 1 })
                        )
                    )
                );
            }
        });
    }
}

CasterlyRock.code = '22008';

module.exports = CasterlyRock;
