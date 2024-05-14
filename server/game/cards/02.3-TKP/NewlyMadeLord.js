const DrawCard = require('../../drawcard.js');

class NewlyMadeLord extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'marshal'
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'location' &&
                    !card.isLimited() &&
                    card.getPrintedCost() <= 3,
                gameAction: 'discard'
            },
            handler: (context) => {
                context.target.owner.discardCard(context.target);
                this.game.addMessage(
                    '{0} uses {1} to discard {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

NewlyMadeLord.code = '02051';

module.exports = NewlyMadeLord;
