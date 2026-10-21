import DrawCard from '../../drawcard.js';

class LaughingLord extends DrawCard {
    // Laughing Lord (08048)
    // Reaction: After you initiate a challenge, kneel Laughing Lord to choose an attacking
    // [baratheon] character. Until the end of the challenge, that character gains intimidate.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event) => event.challenge.attackingPlayer === this.controller
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isAttacking() &&
                    card.isFaction('baratheon')
            },
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.addKeyword('intimidate')
                }));

                this.game.addMessage(
                    '{0} kneels {1} to give {2} intimidate until the end of the challenge',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

LaughingLord.code = '08048';

export default LaughingLord;
