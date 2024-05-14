import DrawCard from '../../drawcard.js';

class TyrionLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) => event.challenge.winner === this.controller
            },
            cost: ability.costs.returnToHand((card) => this.isAttackingClansman(card)),
            limit: ability.limit.perPhase(2),
            choices: {
                'Draw 2 cards': (context) => {
                    if (this.controller.canDraw()) {
                        this.controller.drawCardsToHand(2);
                        this.game.addMessage(
                            '{0} uses {1} to return {2} to their hand to draw 2 cards',
                            this.controller,
                            this,
                            context.costs.returnToHand
                        );
                    }
                },
                'Gain 3 gold': (context) => {
                    if (this.controller.canGainGold()) {
                        let gold = this.game.addGold(this.controller, 3);
                        this.game.addMessage(
                            '{0} uses {1} to return {2} to their hand to gain {3} gold',
                            this.controller,
                            this,
                            context.costs.returnToHand,
                            gold
                        );
                    }
                },
                'Raise claim by 1': (context) => {
                    this.untilEndOfChallenge((ability) => ({
                        match: (card) => card === this.controller.activePlot,
                        effect: ability.effects.modifyClaim(1)
                    }));
                    this.game.addMessage(
                        '{0} uses {1} to return {2} to their hand to raise their claim by 1',
                        this.controller,
                        this,
                        context.costs.returnToHand
                    );
                }
            }
        });
    }

    isAttackingClansman(card) {
        return card.getType() === 'character' && card.hasTrait('Clansman') && card.isAttacking();
    }
}

TyrionLannister.code = '05002';

export default TyrionLannister;
