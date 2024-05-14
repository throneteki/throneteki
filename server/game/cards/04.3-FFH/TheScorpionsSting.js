const DrawCard = require('../../drawcard.js');

class TheScorpionsSting extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller &&
                    this.controller.getNumberOfUsedPlots() >= 1 &&
                    this.hasMartellCharacter()
            },
            handler: (context) => {
                this.game.promptForSelect(context.player, {
                    numCards: context.player.getNumberOfUsedPlots(),
                    multiSelect: true,
                    activePromptTitle:
                        'Select up to ' + context.player.getNumberOfUsedPlots() + ' characters',
                    source: this,
                    cardCondition: (card) =>
                        card.isFaction('martell') &&
                        card.getType() === 'character' &&
                        card.location === 'play area',
                    onSelect: (player, cards) => this.targetsSelected(player, cards)
                });
            }
        });
    }

    targetsSelected(player, cards) {
        this.untilEndOfPhase((ability) => ({
            match: cards,
            effect: ability.effects.addKeyword('renown')
        }));

        this.game.addMessage(
            '{0} plays {1} to give {2} renown until the end of the phase',
            player,
            this,
            cards
        );

        return true;
    }

    hasMartellCharacter() {
        return this.game.anyCardsInPlay(
            (card) => card.isFaction('martell') && card.getType() === 'character'
        );
    }
}

TheScorpionsSting.code = '04056';

module.exports = TheScorpionsSting;
