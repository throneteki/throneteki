import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TyrionLannister extends DrawCard {
    // Tyrion Lannister (01089)
    // Stealth.
    // Reaction: After an [intrigue] challenge is initiated, gain 2 gold. (Limit twice per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.initiatedChallengeType === 'intrigue' &&
                    context.source.controller.canGainGold()
            },
            limit: ability.limit.perRound(2),
            message: '{player} uses {source} to gain 2 gold',
            gameAction: GameActions.gainGold((context) => ({ player: context.player, amount: 2 }))
        });
    }
}

TyrionLannister.code = '01089';

export default TyrionLannister;
