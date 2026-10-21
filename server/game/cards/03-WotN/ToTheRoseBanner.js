import DrawCard from '../../drawcard.js';

class ToTheRoseBanner extends DrawCard {
    // To the Rose Banner! (03038)
    // Marshaling Action: Choose a [tyrell] character you control. Gain X gold, where X is that
    // character's STR. Then, sacrifice that character.
    setupCardAbilities() {
        this.action({
            title: 'Gain gold then sacrifice character',
            phase: 'marshal',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.isFaction('tyrell') &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                let gold = context.target.getStrength();
                gold = this.game.addGold(this.controller, gold);

                context.player.sacrificeCard(context.target);
                this.game.addMessage(
                    '{0} uses {1} to gain {2} gold then sacrifice {3}',
                    context.player,
                    this,
                    gold,
                    context.target
                );
            }
        });
    }
}

ToTheRoseBanner.code = '03038';

export default ToTheRoseBanner;
