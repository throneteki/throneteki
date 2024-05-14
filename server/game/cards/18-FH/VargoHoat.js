const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');
const { Tokens } = require('../../Constants');
const { flatten } = require('../../../Array');

class VargoHoat extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.getType() !== 'plot' && event.card.isBestow()
            },
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.placeToken((context) => ({
                        card: context.event.card,
                        token: Tokens.gold
                    })),
                    context
                );
                this.game.addMessage(
                    '{0} uses {1} to have {2} gain 1 gold',
                    this.controller,
                    this,
                    context.event.card
                );
            },
            limit: ability.limit.perPhase(2)
        });

        this.action({
            title: 'Move 1 gold to character',
            condition: () => this.hasToken(Tokens.gold),
            target: {
                type: 'select',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    (!card.hasToken(Tokens.gold) || card.tokens[Tokens.gold] < 3)
            },
            handler: (context) => {
                this.game.transferGold({ from: this, to: context.target, amount: 1 });
                //adding the untilEndOfPhase effect in a step after the resolution of this handler function
                //to work around timing issues in case the transfer of gold leads to the target gaining a keyword
                //(for example Golden Company)
                this.game.queueSimpleStep(() => {
                    this.untilEndOfPhase((ability) => ({
                        match: this,
                        effect: flatten(
                            context.target
                                .getKeywords()
                                .map((keyword) => ability.effects.addKeyword(keyword))
                        )
                    }));
                });
                this.game.addMessage(
                    "{0} uses {1} to move 1 gold from {1} to {2} to have {1} gain {2}'s keywords",
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

VargoHoat.code = '18017';

module.exports = VargoHoat;
