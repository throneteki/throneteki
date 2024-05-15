import DrawCard from '../../drawcard.js';

class RecruitFromTheDungeons extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Have character participate in the challenge',
            condition: (context) =>
                this.game.isDuringChallenge({ defendingPlayer: context.player }) &&
                this.canParticipateInChallenge(),
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                this.challengeToParticipateIn = this.game.currentChallenge;
                this.challengeToParticipateIn.addDefender(this);
                this.game.addMessage(
                    '{0} kneels {1} to have {1} participate in the challenge on their side',
                    context.player,
                    this
                );
                this.game.once('afterChallenge', () =>
                    this.afterChallenge(this.challengeToParticipateIn, context)
                );
            }
        });
    }

    afterChallenge(challenge, context) {
        if (challenge.loser === context.player) {
            context.player.moveCard(this, 'shadows');
            this.game.addMessage('{0} returns {1} to shadows', context.player, this);
        }
    }
}

RecruitFromTheDungeons.code = '13105';

export default RecruitFromTheDungeons;
