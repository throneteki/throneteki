import DrawCard from '../../drawcard.js';

class ShadowblackAssassin extends DrawCard {
    // Shadowblack Assassin (13073)
    // Shadow (2).
    // Reaction: After Shadowblack Assassin comes out of shadows, choose and kill a character with
    // STR 1 or lower.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() <= 1
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to kill {2}',
                    context.player,
                    this,
                    context.target
                );
                this.game.killCharacter(context.target);
            }
        });
    }
}

ShadowblackAssassin.code = '13073';

export default ShadowblackAssassin;
