import DrawCard from '../../drawcard.js';

class Varys extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('outOfShadows', () =>
                this.game
                    .getPlayers()
                    .reduce(
                        (acc, player) =>
                            acc + player.shadows.filter((card) => card !== this).length,
                        0
                    )
            )
        });

        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPower() > 0
            },
            handler: (context) => {
                this.game.killCharacter(context.target);
                this.game.addMessage(
                    '{0} uses {1} to kill {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

Varys.code = '11119';

export default Varys;
