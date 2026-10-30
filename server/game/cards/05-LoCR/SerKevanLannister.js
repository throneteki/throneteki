import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerKevanLannister extends DrawCard {
    // Ser Kevan Lannister (05003)
    // Reaction: After you marshal Ser Kevan Lannister, choose a [lannister] or neutral location or
    // attachment in your discard pile and put it into play.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && event.playingType === 'marshal'
            },
            target: {
                activePromptTitle: 'Select a location or attachment',
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.controller === context.source.controller &&
                    (card.isFaction('lannister') || card.isFaction('neutral')) &&
                    (card.getType() === 'location' || card.getType() === 'attachment')
            },
            message: '{player} uses {source} to put {target} into play',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

SerKevanLannister.code = '05003';

export default SerKevanLannister;
