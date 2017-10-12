const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class MeleeAtBitterbridge extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character renown',
            condition: () => this.game.currentChallenge && this.game.currentChallenge.getNumberOfParticipants() > 0,
            cost: ability.costs.payXGold(() => 1, () => this.game.currentChallenge.getNumberOfParticipants()),
            handler: context => {
                let xValue = context.xValue;
                this.game.promptForSelect(this.controller, {
                    mode: 'exactly',
                    numCards: xValue,
                    activePromptTitle: 'Select ' + (xValue === 1 ? 'a' : xValue) + ' character' + (xValue === 1 ? '' : 's'),
                    source: this,
                    cardCondition: card => card.location === 'play area' && this.game.currentChallenge.isParticipating(card),
                    onSelect: (player, cards) => this.targetsSelected(player, cards, context.goldCost)
                });
            }
        });
    }

    targetsSelected(player, cards, goldCost) {
        let strengths = _.map(cards, card => card.getStrength());
        let highestStrength = _.max(strengths);
        let renownCharacters = _.filter(cards, card => card.getStrength() === highestStrength);

        this.untilEndOfChallenge(ability => ({
            match: card => renownCharacters.includes(card),
            targetController: 'any',
            effect: ability.effects.addKeyword('renown')
        }));

        let nonContributingCharacters = _.reject(cards, card => card.getStrength() === highestStrength);

        this.untilEndOfChallenge(ability => ({
            match: card => nonContributingCharacters.includes(card),
            targetController: 'any',
            effect: ability.effects.doesNotContributeStrength()
        }));

        let message = '{0} plays {1} and pays {2} gold to give renown to {3}';

        if(!_.isEmpty(nonContributingCharacters)) {
            message += ' and have {4} not contribute strength to the challenge';
        }

        this.game.addMessage(message, player, this, goldCost, renownCharacters, nonContributingCharacters);

        return true;
    }
}

MeleeAtBitterbridge.code = '09022';

module.exports = MeleeAtBitterbridge;
