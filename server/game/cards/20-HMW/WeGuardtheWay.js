import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class WeGuardtheWay extends DrawCard {
    // We Guard the Way (20020)
    // Action: Choose X characters with the Guard or House Yronwood trait. Until the end of the
    // phase, each chosen character gains renown and does not kneel when declared as a defender.
    setupCardAbilities() {
        this.xValue({
            min: () => 1,
            max: () =>
                this.game.getNumberOfCardsInPlay(
                    (card) =>
                        card.getType() === 'character' &&
                        (card.hasTrait('Guard') || card.hasTrait('House Yronwood'))
                )
        });

        this.action({
            handler: (context) => {
                let xValue = context.xValue;
                this.game.promptForSelect(context.player, {
                    mode: 'exactly',
                    numCards: xValue,
                    activePromptTitle: `Select ${TextHelper.count(xValue, 'character')}`,
                    source: this,
                    cardCondition: (card) =>
                        card.location === 'play area' &&
                        card.getType() === 'character' &&
                        (card.hasTrait('Guard') || card.hasTrait('House Yronwood')),
                    onSelect: (player, cards) => this.targetsSelected(player, cards, xValue)
                });
            }
        });
    }

    targetsSelected(player, cards, xValue) {
        this.untilEndOfPhase((ability) => ({
            match: cards,
            targetController: 'any',
            effect: [ability.effects.addKeyword('renown'), ability.effects.doesNotKneelAsDefender()]
        }));

        this.game.addMessage(
            '{0} plays {1} and pays {2} gold to have {3} gain renown and not kneel when declared as a defender this phase',
            player,
            this,
            xValue,
            cards
        );

        return true;
    }
}

WeGuardtheWay.code = '20020';

export default WeGuardtheWay;
