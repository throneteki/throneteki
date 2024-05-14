import DrawCard from '../../drawcard.js';

class PlazaOfPunishment extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'power'
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.attachments.length === 0
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.killByStrength(-2)
                }));

                this.game.addMessage(
                    '{0} kneels {1} to give {2} -2 STR until the end of the phase and kill it if its STR is 0',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

PlazaOfPunishment.code = '01173';

export default PlazaOfPunishment;
