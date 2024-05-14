const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');
const { flatten } = require('../../../Array');

class ALionStillHasClaws extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () => this.game.anyPlotHasTrait('Scheme'),
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('play', () => this.numOfSchemePlotsRevealed())
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({
                        winner: this.controller,
                        challengeType: 'intrigue',
                        by5: true
                    })
            },
            cost: ability.costs.payXGold(
                () => 0,
                () => 99
            ),
            handler: (context) => {
                this.context = context;

                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Name a trait',
                        controls: [
                            { type: 'trait-name', command: 'menuButton', method: 'selectTraitName' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    numOfSchemePlotsRevealed() {
        let plots = this.game
            .getPlayers()
            .filter((player) => player.activePlot && player.activePlot.hasTrait('Scheme'));

        return plots.length;
    }

    selectTraitName(player, traitName) {
        let cardsToReturn = [];
        for (let player of this.game.getPlayers()) {
            cardsToReturn.push(
                player.filterCardsInPlay(
                    (card) =>
                        card.getType() === 'character' &&
                        card.hasTrait(traitName) &&
                        card.getPrintedCost() <= this.context.xValue
                )
            );
        }
        this.game.resolveGameAction(
            GameActions.simultaneously(
                flatten(cardsToReturn).map((card) => GameActions.returnCardToHand({ card }))
            )
        );

        this.game.addMessage(
            "{0} plays {1} to return each {2} character to its owner's hand",
            player,
            this,
            traitName
        );

        return true;
    }
}

ALionStillHasClaws.code = '20014';

module.exports = ALionStillHasClaws;
