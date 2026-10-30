import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TyrionLannister extends DrawCard {
    // Tyrion Lannister (05002)
    // Reaction: After you win a challenge, return an attacking Clansman character to your hand to
    // (choose one): draw 2 cards, gain 3 gold, or raise the claim value on your revealed plot card
    // by 1 until the end of the challenge. (Limit twice per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) => event.challenge.winner === context.player
            },
            cost: ability.costs.returnToHand(
                (card) =>
                    card.getType() === 'character' &&
                    card.hasTrait('Clansman') &&
                    card.isAttacking()
            ),
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
                'Raise claim by 1': {
                    message:
                        '{player} uses {source} to return {costs.returnToHand} to their hand to raise their claim by 1',
                    gameAction: GameActions.lastingEffect((context) => ({
                        duration: 'untilEndOfChallenge',
                        match: context.player.activePlot,
                        effect: ability.effects.modifyClaim(1)
                    }))
                }
            }
        });
    }
}

TyrionLannister.code = '05002';

export default TyrionLannister;
