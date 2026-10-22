import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerBalonSwann extends DrawCard {
    // Ser Balon Swann (17165)
    // Renown.
    // Reaction: After a non-[lannister] Knight character enters play under your control, gain 2
    // gold. (Limit once per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.controller === context.source.controller &&
                    !event.card.isFaction('lannister') &&
                    event.card.hasTrait('knight') &&
                    event.card.getType() === 'character' &&
                    context.source.controller.canGainGold()
            },
            limit: ability.limit.perRound(1),
            message: '{player} uses {source} to gain 2 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 2 }))
        });
    }
}

SerBalonSwann.code = '17165';

export default SerBalonSwann;
