import DrawCard from '../../drawcard.js';

class WhiteHarborWatchman extends DrawCard {
    // White Harbor Watchman (13061)
    // Reaction: After a character comes out of shadows, sacrifice White Harbor Watchman to kill
    // that character.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card.getType() === 'character'
            },
            cost: ability.costs.sacrificeSelf(),
            handler: (context) => {
                this.game.killCharacter(context.event.card);
                this.game.addMessage(
                    '{0} sacrifices {1} to kill {2}',
                    this.controller,
                    this,
                    context.event.card
                );
            }
        });
    }
}

WhiteHarborWatchman.code = '13061';

export default WhiteHarborWatchman;
