import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class MeleeAtBitterbridge extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character renown',
            condition: () =>
                this.game.currentChallenge &&
                this.game.currentChallenge.getNumberOfParticipants() > 0,
            cost: ability.costs.payXGold(
                () => 1,
                () => this.game.currentChallenge.getNumberOfParticipants()
            ),
            handler: (context) => {
                let xValue = context.xValue;
                this.game.promptForSelect(this.controller, {
                    mode: 'exactly',
                    numCards: xValue,
                    activePromptTitle: `Select ${TextHelper.count(xValue, 'character')}`,
                    source: this,
                    cardCondition: (card) =>
                        card.location === 'play area' && card.isParticipating(),
                    onSelect: (player, cards) =>
                        this.targetsSelected(player, cards, context.goldCost)
                });
            }
        });
    }

    targetsSelected(player, cards, goldCost) {
        let strengths = cards.map((card) => card.getStrength());
        let highestStrength = Math.max(...strengths);
        let renownCharacters = cards.filter((card) => card.getStrength() === highestStrength);

        this.untilEndOfChallenge((ability) => ({
            match: renownCharacters,
            targetController: 'any',
            effect: ability.effects.addKeyword('renown')
        }));

        let nonContributingCharacters = cards.filter(
            (card) => card.getStrength() !== highestStrength
        );

        this.untilEndOfChallenge((ability) => ({
            match: nonContributingCharacters,
            targetController: 'any',
            effect: ability.effects.doesNotContributeStrength()
        }));

        let message = '{0} plays {1} and pays {2} gold to give renown to {3}';

        if (nonContributingCharacters.legnth > 0) {
            message += ' and have {4} not contribute strength to the challenge';
        }

        this.game.addMessage(
            message,
            player,
            this,
            goldCost,
            renownCharacters,
            nonContributingCharacters
        );

        return true;
    }
}

MeleeAtBitterbridge.code = '09022';

export default MeleeAtBitterbridge;
