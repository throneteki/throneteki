import DrawCard from '../../drawcard.js';

class HoldfastVillage extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce next card',
            clickToActivate: true,
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to reduce the cost of the next card by 1',
                    context.player,
                    this
                );
                this.untilEndOfPhase((ability) => ({
                    condition: () => !context.abilityDeactivated,
                    targetController: 'current',
                    effect: ability.effects.reduceNextMarshalledCardCost(1)
                }));
            }
        });

        this.action({
            title: 'Sacrifice to draw 1 card or gain 1 gold',
            cost: ability.costs.sacrificeSelf(),
            choices: {
                'Gain 1 gold': (context) => {
                    if (context.player.canGainGold()) {
                        this.game.addGold(context.player, 1);
                        this.game.addMessage(
                            '{0} sacrifices {1} to gain 1 gold',
                            context.player,
                            this
                        );
                    }
                },
                'Draw 1 card': (context) => {
                    if (context.player.canDraw()) {
                        context.player.drawCardsToHand(1);
                        this.game.addMessage(
                            '{0} sacrifices {1} to draw 1 card',
                            context.player,
                            this
                        );
                    }
                }
            }
        });
    }
}

HoldfastVillage.code = '00370';

export default HoldfastVillage;
