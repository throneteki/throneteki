const DrawCard = require('../../../drawcard.js');

class TheScorpionsSting extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.loser === this.controller && 
                    this.controller.getNumberOfUsedPlots() >= 1 &&
                    this.hasMartellCharacter())
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    numCards: this.controller.getNumberOfUsedPlots(),
                    multiSelect: true,
                    activePromptTitle: 'Select up to ' + this.controller.getNumberOfUsedPlots() + ' characters',
                    source: this,
                    cardCondition: card => card.isFaction('martell') && card.getType() === 'character',
                    onSelect: (player, cards) => this.targetsSelected(player, cards)
                });
            }
        });
    }

    targetsSelected(player, cards) {
        this.untilEndOfPhase(ability => ({
            match: card => cards.includes(card),
            effect: ability.effects.addKeyword('renown')
        }));

        this.game.addMessage('{0} plays {1} to give {2} renown until the end of the phase', 
                              player, this, cards);

        return true;
    }

    hasMartellCharacter() {
        return this.controller.anyCardsInPlay(card => card.isFaction('martell') && card.getType() === 'character');
    }
}

TheScorpionsSting.code = '04056';

module.exports = TheScorpionsSting;
