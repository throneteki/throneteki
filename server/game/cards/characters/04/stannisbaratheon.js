const DrawCard = require('../../../drawcard.js');

class StannisBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'power'),
            match: (card) => this.game.currentChallenge.isParticipating(card) && !card.hasTrait('King'),
            targetController: 'any',
            effect: ability.effects.modifyStrength(-1),
            recalculateWhen: ['onAttackersDeclared', 'onDefendersDeclared']
        });

        this.reaction({
            when: {
                onDominanceDetermined: (event, winner) =>
                    this.controller === winner
                    && this.controller.filterCardsInPlay(card => this.canBeStoppedFromStanding(card)).length > 0
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => this.canBeStoppedFromStanding(card),
                    activePromptTitle: 'Select a character',
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    canBeStoppedFromStanding(card) {
        return card.location === 'play area'
            && card.getType() === 'character'
            && card.kneeled
            && !card.isLoyal();
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to make {2} unable to stand during the standing phase this round', 
                              player, this, card);

        this.untilEndOfRound(ability => ({
            match: card,
            effect: ability.effects.doesNotStandDuringStanding()
        }));

        return true;
    }
}

StannisBaratheon.code = '04067';

module.exports = StannisBaratheon;
