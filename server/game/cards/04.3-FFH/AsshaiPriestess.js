import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AsshaiPriestess extends DrawCard {
    // Asshai Priestess (04047)
    // Reaction: After you marshal Asshai Priestess, choose and kneel a character with STR 2 or
    // lower.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && event.playingType === 'marshal'
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() <= 2 &&
                    !card.kneeled,
                gameAction: 'kneel'
            },
            message: '{player} uses {source} to kneel {target}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.target }))
        });
    }
}

AsshaiPriestess.code = '04047';

export default AsshaiPriestess;
