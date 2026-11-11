import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CorsairsDirk extends DrawCard {
    // Corsair's Dirk (06052)
    // Ironborn character only.
    // Attached character gets +2 STR.
    // Reaction: After you win a challenge in which attached character is attacking, move 1 gold
    // from the losing opponent's gold pool to your own.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Ironborn' });
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.isAttacking(context.source.parent)
            },
            message: {
                format: "{player} uses {source} to move 1 gold from {opponent}'s gold pool to their own",
                args: { opponent: (context) => context.event.challenge.defendingPlayer }
            },
            gameAction: GameActions.transferGold((context) => ({
                from: context.event.challenge.defendingPlayer,
                to: context.player,
                amount: 1
            }))
        });
    }
}

CorsairsDirk.code = '06052';

export default CorsairsDirk;
