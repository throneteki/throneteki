import DrawCard from '../../drawcard.js';

class TheNightfort extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character +STR',
            condition: () =>
                this.game.isDuringChallenge({
                    match: (challenge) => challenge.attackers.length >= 1
                }),
            phase: 'challenge',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isDefending() &&
                    card.isFaction('thenightswatch')
            },
            handler: (context) => {
                let strBoost = this.game.currentChallenge.attackers.length;
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(strBoost)
                }));

                this.game.addMessage(
                    '{0} kneels {1} to give {2} +{3} STR until the end of the challenge',
                    context.player,
                    this,
                    context.target,
                    strBoost
                );
            }
        });
    }
}

TheNightfort.code = '00013';

export default TheNightfort;
