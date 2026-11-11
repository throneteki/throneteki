import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class KingRobertsWarhammer extends DrawCard {
    // King Robert's Warhammer (02008)
    // Attached character gets +1 STR.
    // Reaction: After you win a challenge in which attached character is participating as an
    // attacker, choose and kneel up to X total STR worth of characters, where X is attached
    // character's STR. Then, sacrifice King Robert's Warhammer.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.isAttacking(context.source.parent)
            },
            target: {
                activePromptTitle: 'Select character(s)',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.kneeled,
                maxStat: (context) => context.source.parent.getStrength(),
                cardStat: (card) => card.getStrength(),
                gameAction: 'kneel'
            },
            message: '{player} uses {source} to kneel {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.kneelCard({ card }))
            ).then({
                message: '{player} then sacrifices {source}',
                gameAction: GameActions.sacrificeCard((context) => ({ card: context.source }))
            })
        });
    }
}

KingRobertsWarhammer.code = '02008';

export default KingRobertsWarhammer;
