const DrawCard = require('../../drawcard.js');

class TheFrozenShore extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.getNumOfAttackingWildlings(event.challenge) > 0 &&
                    this.getNumOfWinterPlots() > 0
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let numWinterPlots = this.getNumOfWinterPlots();
                this.game.promptForSelect(this.controller, {
                    numCards: numWinterPlots,
                    multiSelect: true,
                    activePromptTitle: 'Select up to ' + numWinterPlots + ' Wildlings to stand',
                    cardCondition: (card) => card.isAttacking() && card.hasTrait('Wildling'),
                    onSelect: (player, cards) => this.standWildlings(player, cards),
                    source: this
                });
            }
        });
    }

    standWildlings(player, cards) {
        for (let card of cards) {
            player.standCard(card);
        }
        this.game.addMessage('{0} uses {1} to stand {2}', player, this, cards);
        return true;
    }

    getNumOfAttackingWildlings(challenge) {
        return challenge.attackers.filter((card) => card.hasTrait('Wildling')).length;
    }

    getNumOfWinterPlots() {
        return this.game
            .getPlayers()
            .filter((player) => player.activePlot && player.activePlot.hasTrait('Winter')).length;
    }
}

TheFrozenShore.code = '07042';

module.exports = TheFrozenShore;
