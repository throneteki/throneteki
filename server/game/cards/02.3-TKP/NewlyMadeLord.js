import DrawCard from '../../drawcard.js';

class NewlyMadeLord extends DrawCard {
    // Newly-Made Lord (02051)
    // Reaction: After you marshal Newly-Made Lord, choose a non-limited location with printed cost
    // 3 or lower, and discard it from play.
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

export default NewlyMadeLord;
