import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class RitualOfRhllor extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: (event) =>
                    this.controller === event.winner && this.getNumberOfStandingRhllor() >= 1
            },
            cost: ability.costs.payXGold(
                () => 1,
                () => this.getNumberOfStandingRhllor()
            ),
            handler: (context) => {
                let xValue = context.xValue;
                this.game.promptForSelect(this.controller, {
                    mode: 'exactly',
                    numCards: xValue,
                    gameAction: 'gainPower',
                    activePromptTitle: `Select ${TextHelper.count(xValue, 'character')}`,
                    source: this,
                    cardCondition: (card) =>
                        card.location === 'play area' &&
                        !card.kneeled &&
                        card.hasTrait("R'hllor") &&
                        card.getType() === 'character',
                    onSelect: (player, cards) =>
                        this.targetsSelected(player, cards, context.costs.gold)
                });
            }
        });
    }

    targetsSelected(player, cards, goldCost) {
        for (let card of cards) {
            card.modifyPower(1);
        }

        this.game.addMessage(
            '{0} plays {1} and pays {2} gold to have {3} gain 1 power',
            player,
            this,
            goldCost,
            cards
        );

        return true;
    }

    getNumberOfStandingRhllor() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.getType() === 'character' && card.hasTrait("R'hllor") && !card.kneeled
        );
    }
}

RitualOfRhllor.code = '04088';

export default RitualOfRhllor;
