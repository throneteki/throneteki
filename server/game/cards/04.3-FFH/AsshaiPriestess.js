import DrawCard from '../../drawcard.js';

class AsshaiPriestess extends DrawCard {
    // Asshai Priestess (04047)
    // Reaction: After you marshal Asshai Priestess, choose and kneel a character with STR 2 or
    // lower.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this && event.playingType === 'marshal'
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() <= 2 &&
                    !card.kneeled,
                gameAction: 'kneel'
            },
            handler: (context) => {
                this.controller.kneelCard(context.target);
                this.game.addMessage(
                    '{0} uses {1} to kneel {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

AsshaiPriestess.code = '04047';

export default AsshaiPriestess;
