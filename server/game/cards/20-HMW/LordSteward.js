import DrawCard from '../../drawcard.js';

class LordSteward extends DrawCard {
    // Lord Steward (20023)
    // Unique character only.
    // Attached character gains an [intrigue] icon and the Steward trait.
    // Reaction: After you win an [intrigue] challenge in which you control a participating Steward
    // character, choose a character with printed cost X or lower controlled by the losing opponent.
    // Take control of it until the end of the phase. X is the number of Steward characters you
    // control. (Limit once per phase.)
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
