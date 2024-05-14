import DrawCard from '../../drawcard.js';

class DaringRescue extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return character then have knight gain power',
            condition: () => this.hasKnightCharacter(),
            phase: 'challenge',
            target: {
                activePromptTitle: 'Select a character to return to hand',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                context.target.owner.returnCardToHand(context.target);
                this.game.addMessage(
                    "{0} plays {1} to return {2} to its owner's hand",
                    this.controller,
                    this,
                    context.target
                );
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character to gain power',
                    source: this,
                    gameAction: 'gainPower',
                    cardCondition: (card) =>
                        card.location === 'play area' &&
                        card.hasTrait('Knight') &&
                        card.getType() === 'character' &&
                        card.controller === this.controller,
                    onSelect: (p, card) => {
                        card.modifyPower(1);
                        this.game.addMessage(
                            '{0} then uses {1} to have {2} gain 1 power',
                            this.controller,
                            this,
                            card
                        );

                        return true;
                    }
                });
            }
        });
    }

    hasKnightCharacter() {
        return this.controller.anyCardsInPlay(
            (card) => card.hasTrait('Knight') && card.getType() === 'character'
        );
    }
}

DaringRescue.code = '05024';

export default DaringRescue;
