import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TyrionLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) => event.challenge.winner === this.controller
            },
            cost: ability.costs.returnToHand((card) => this.isAttackingClansman(card)),
            limit: ability.limit.perPhase(2),
            choices: {
                'Draw 2 cards': {
                    message: '{player} uses {source} to draw 2 cards',
                    gameAction: GameActions.drawCards((context) => ({
                        player: context.player,
                        amount: 2
                    }))
                },
                'Gain 3 gold': {
                    message: '{player} uses {source} to gain 3 gold',
                    gameAction: GameActions.gainGold((context) => ({
                        player: context.player,
                        amount: 3
                    }))
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
