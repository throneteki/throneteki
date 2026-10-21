import DrawCard from '../../drawcard.js';

class SerKevanLannister extends DrawCard {
    // Ser Kevan Lannister (05003)
    // Reaction: After you marshal Ser Kevan Lannister, choose a [lannister] or neutral location or
    // attachment in your discard pile and put it into play.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'marshal'
            },
            target: {
                activePromptTitle: 'Select a location or attachment',
                cardCondition: (card) =>
                    card.location === 'discard pile' &&
                    card.controller === this.controller &&
                    (card.isFaction('lannister') || card.isFaction('neutral')) &&
                    (card.getType() === 'location' || card.getType() === 'attachment')
            },
            handler: (context) => {
                this.controller.putIntoPlay(context.target);
                this.game.addMessage(
                    '{0} uses {1} to put {2} into play',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

SerKevanLannister.code = '05003';

export default SerKevanLannister;
