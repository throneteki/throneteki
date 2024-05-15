import DrawCard from '../../drawcard.js';

class MaesterVyman extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.isMatch({
                        winner: this.controller,
                        challengeType: ['military', 'power']
                    })
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card !== this &&
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getTraits().some((trait) => this.hasTrait(trait)),
                gameAction: 'gainPower'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to have {2} gain 1 power',
                    context.player,
                    this,
                    context.target
                );
                context.target.modifyPower(1);
            }
        });
    }
}

MaesterVyman.code = '12033';

export default MaesterVyman;
