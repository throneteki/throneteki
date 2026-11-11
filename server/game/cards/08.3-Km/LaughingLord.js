import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class LaughingLord extends DrawCard {
    // Laughing Lord (08048)
    // Reaction: After you initiate a challenge, kneel Laughing Lord to choose an attacking
    // [baratheon] character. Until the end of the challenge, that character gains intimidate.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.attackingPlayer === context.source.controller
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isAttacking() &&
                    card.isFaction('baratheon')
            },
            message:
                '{player} kneels {source} to give {target} intimidate until the end of the challenge',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.addKeyword('intimidate')
            }))
        });
    }
}

LaughingLord.code = '08048';

export default LaughingLord;
