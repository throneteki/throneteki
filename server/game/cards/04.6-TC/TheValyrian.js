import DrawCard from '../../drawcard.js';

class TheValyrian extends DrawCard {
    // The Valyrian (04108)
    // Ambush (2).
    // Action: Kneel The Valyrian to give an attacking character +X STR until the end of the
    // challenge. X is the number of gold in the defending player's gold pool.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give attacking character +STR',
            condition: () =>
                this.game.currentChallenge && this.game.currentChallenge.defendingPlayer.gold >= 1,
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) => card.location === 'play area' && card.isAttacking()
            },
            handler: (context) => {
                let strBoost = this.game.currentChallenge.defendingPlayer.gold;
                this.game.addMessage(
                    '{0} kneels {1} to give {2} +{3} STR until the end of the challenge',
                    this.controller,
                    this,
                    context.target,
                    strBoost
                );

                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(strBoost)
                }));
            }
        });
    }
}

TheValyrian.code = '04108';

export default TheValyrian;
