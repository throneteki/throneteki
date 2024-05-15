import DrawCard from '../../drawcard.js';

class LordSteward extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true });
        this.whileAttached({
            effect: [ability.effects.addIcon('intrigue'), ability.effects.addTrait('Steward')]
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'intrigue' &&
                    this.isStewardParticipatingInChallenge()
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.game.currentChallenge.loser &&
                    card.getPrintedCost() <= this.getNumberOfStewards()
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to take control of {target}',
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.takeControl(context.player)
                }));
            }
        });
    }

    isStewardParticipatingInChallenge() {
        return this.controller.anyCardsInPlay(
            (card) => card.isParticipating() && card.hasTrait('Steward')
        );
    }

    getNumberOfStewards() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.getType() === 'character' && card.hasTrait('Steward')
        );
    }
}

LordSteward.code = '20023';

export default LordSteward;
